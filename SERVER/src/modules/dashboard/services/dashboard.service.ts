import { Injectable } from '@nestjs/common';
import { DashboardRepository } from '../repositories/dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly repo: DashboardRepository) {}

  async getStats() {
    const [counts, todayBookings] = await Promise.all([
      this.repo.getCounts(),
      this.repo.getTodayBookingsCount(),
    ]);
    return { ...counts, todayBookings };
  }
}
