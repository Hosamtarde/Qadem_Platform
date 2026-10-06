import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ResponseStatsService } from "./response-stats.service";

@Injectable()
export class ResponseStatsTask {
  private readonly logger = new Logger(ResponseStatsTask.name);

  constructor(private readonly statsService: ResponseStatsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyRecompute(): Promise<void> {
    try {
      await this.statsService.recomputeAll();
    } catch (err) {

      this.logger.error("Hourly response stats recompute failed", err as Error);
    }
  }
}