import { Injectable } from '@nestjs/common';
import { ArticleStatus, DoctorStatus, ServiceStatus, VacancyStatus, AdCampaignStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SimrsService } from '../../../simrs/simrs.service';

@Injectable()
export class DashboardRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly simrs: SimrsService,
  ) {}

  async getCounts() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalDoctors,
      activeDoctors,
      totalServices,
      totalArticles,
      publishedArticles,
      activeAds,
      totalVacancies,
      publishedVacancies,
      totalMedia,
      totalAppointments,
      totalAppointmentsToday,
      recentAppointments,
    ] = await this.prisma.$transaction([
      this.prisma.doctor.count(),
      this.prisma.doctor.count({ where: { status: DoctorStatus.AKTIF } }),
      this.prisma.service.count({ where: { status: ServiceStatus.AKTIF } }),
      this.prisma.article.count(),
      this.prisma.article.count({ where: { status: ArticleStatus.PUBLISHED } }),
      this.prisma.adCampaign.count({ where: { status: AdCampaignStatus.AKTIF } }),
      this.prisma.jobVacancy.count(),
      this.prisma.jobVacancy.count({ where: { status: VacancyStatus.PUBLISHED } }),
      this.prisma.media.count(),
      this.prisma.appointment.count(),
      this.prisma.appointment.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          patientName: true,
          doctorName: true,
          date: true,
          status: true,
        },
      }),
    ]);

    return {
      totalDoctors,
      activeDoctors,
      totalServices,
      totalArticles,
      publishedArticles,
      activeAds,
      totalVacancies,
      publishedVacancies,
      totalMedia,
      totalAppointments,
      totalAppointmentsToday,
      recentAppointments: recentAppointments.map((a) => ({
        id: a.id,
        patientName: a.patientName,
        doctorName: a.doctorName ?? '-',
        date: a.date.toISOString().split('T')[0],
        status: a.status,
      })),
    };
  }

  /** Best-effort - SIMRS may be unreachable, in which case this returns null and the
   * dashboard degrades gracefully instead of failing the whole stats endpoint. */
  async getTodayBookingsCount(): Promise<number | null> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      return await this.simrs.bookingPeriksa.count({
        where: { tanggal: { gte: startOfDay, lte: endOfDay } },
      });
    } catch {
      return null;
    }
  }
}

