import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Company } from "./entities/company.entity";


export const MIN_SAMPLE = 10;

interface StatsRow {
  companyId: string;
  total: string;
  answered: string;
  avgDays: string | null;
}

@Injectable()
export class ResponseStatsService {
  private readonly logger = new Logger(ResponseStatsService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

  async recomputeAll(): Promise<{ updated: number }> {
    const rows = await this.dataSource.query<StatsRow[]>(`
      SELECT
        j."companyId" AS "companyId",
        COUNT(*)::text AS "total",
        COUNT(*) FILTER (WHERE a."respondedAt" IS NOT NULL)::text AS "answered",
        AVG(
          EXTRACT(EPOCH FROM (a."respondedAt" - a."createdAt")) / 86400
        ) FILTER (WHERE a."respondedAt" IS NOT NULL)::text AS "avgDays"
      FROM applications a
      JOIN jobs j ON j.id = a."jobId"
      GROUP BY j."companyId"
    `);

    let updated = 0;

    for (const row of rows) {
      const total = Number(row.total);
      const answered = Number(row.answered);
      const rate = total > 0 ? (answered / total) * 100 : 0;

      await this.companiesRepository.update(row.companyId, {
        responseRate: rate.toFixed(2),
        avgResponseDays: row.avgDays
          ? Number(row.avgDays).toFixed(2)
          : null,
        responseSampleSize: total,
        responseStatsAt: new Date(),
      });

      updated += 1;
    }

    this.logger.log(`Response stats recomputed for ${updated} companies`);
    return { updated };
  }


  async recomputeForCompany(companyId: string): Promise<void> {
    const rows = await this.dataSource.query<StatsRow[]>(
      `
      SELECT
        j."companyId" AS "companyId",
        COUNT(*)::text AS "total",
        COUNT(*) FILTER (WHERE a."respondedAt" IS NOT NULL)::text AS "answered",
        AVG(
          EXTRACT(EPOCH FROM (a."respondedAt" - a."createdAt")) / 86400
        ) FILTER (WHERE a."respondedAt" IS NOT NULL)::text AS "avgDays"
      FROM applications a
      JOIN jobs j ON j.id = a."jobId"
      WHERE j."companyId" = $1
      GROUP BY j."companyId"
      `,
      [companyId],
    );

    if (rows.length === 0) return;

    const row = rows[0];
    const total = Number(row.total);
    const answered = Number(row.answered);
    const rate = total > 0 ? (answered / total) * 100 : 0;

    await this.companiesRepository.update(companyId, {
      responseRate: rate.toFixed(2),
      avgResponseDays: row.avgDays ? Number(row.avgDays).toFixed(2) : null,
      responseSampleSize: total,
      responseStatsAt: new Date(),
    });
  }
}