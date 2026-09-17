import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { CompaniesModule } from '../companies/companies.module';
import { CandidatesModule } from '../candidates/candidates.module';
import { EmailVerificationToken } from './entities/email-verification-token.entity';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    CompaniesModule,
    CandidatesModule,
    TypeOrmModule.forFeature([EmailVerificationToken]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}