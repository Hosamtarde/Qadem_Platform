import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, createHash } from 'crypto';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/entities/user.entity';
import { CompaniesService } from '../companies/companies.service';
import { UserRole } from '../../common/enums';
import { CandidatesService } from '../candidates/candidates.service';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { MailService } from '../mail/mail.service';
import { verificationEmail } from '../mail/mail.templates';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly candidatesService: CandidatesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(EmailVerificationToken)
    private readonly tokensRepo: Repository<EmailVerificationToken>,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      role: dto.role,
    });

    if (user.role === UserRole.COMPANY) {
      await this.companiesService.createForUser(user.id, user.fullName);
    } else {
      await this.candidatesService.createForUser(user.id);
    }

    await this.sendVerification(user);

    return {
      message: 'Account created. Check your email to verify it.',
      email: user.email,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Email not verified',
      });
    }

    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findByIdWithRefreshToken(userId);

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!tokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    return this.issueTokens(user);
  }

  private async sendVerification(user: User) {
    const raw = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(raw).digest('hex');

    await this.tokensRepo.save(
      this.tokensRepo.create({
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      }),
    );

    const base = this.configService.get<string>('FRONTEND_URL') ?? '';
    const link = `${base}/verify-email?token=${raw}`;

    await this.mailService.send(
      user.email,
      'Activating your account on the Qadem platform',
      verificationEmail(user.fullName, link),
    );
  }

  async verifyEmail(raw: string) {
    const tokenHash = createHash('sha256').update(raw).digest('hex');
    const record = await this.tokensRepo.findOne({ where: { tokenHash } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    await this.usersService.markEmailVerified(record.userId);

    record.usedAt = new Date();
    await this.tokensRepo.save(record);

    return { message: 'The account has been successfully activated.' };
  }

  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (user && !user.isEmailVerified) {
      await this.sendVerification(user);
    }

    return { message: 'If the email is registered and unverified, a new link was sent.' };
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.accessSecret') ?? '',
      expiresIn:
        this.configService.get<StringValue>('jwt.accessExpiresIn') ?? '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret') ?? '',
      expiresIn:
        this.configService.get<StringValue>('jwt.refreshExpiresIn') ?? '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}