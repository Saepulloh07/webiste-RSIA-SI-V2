import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export interface FindAppointmentsParams {
  status?: AppointmentStatus;
  search?: string;
  date?: string;
  skip?: number;
  take?: number;
  orderBy?: Prisma.AppointmentOrderByWithRelationInput;
}

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: FindAppointmentsParams): Promise<{ items: Appointment[]; totalItems: number }> {
    const where: Prisma.AppointmentWhereInput = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.date) {
      const targetDate = new Date(params.date);
      where.date = targetDate;
    }

    if (params.search) {
      const q = params.search.trim();
      where.OR = [
        { id: { contains: q } },
        { patientName: { contains: q } },
        { phone: { contains: q } },
        { doctorName: { contains: q } },
        { serviceName: { contains: q } },
      ];
    }

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy ?? { createdAt: 'desc' },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { items, totalItems };
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({
      data,
    });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Appointment> {
    return this.prisma.appointment.delete({
      where: { id },
    });
  }

  async countToday(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.appointment.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }
}
