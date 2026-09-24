import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Appointment, AppointmentStatus } from '@prisma/client';
import { AppointmentsRepository } from '../repositories/appointments.repository';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { QueryAppointmentDto } from '../dto/query-appointment.dto';
import { SettingsRepository } from '../../settings/repositories/settings.repository';
import { buildPaginationMeta, paginationSkip, parseSort } from '../../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['patientName', 'date', 'status', 'createdAt', 'updatedAt'];

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly repo: AppointmentsRepository,
    private readonly settingsRepo: SettingsRepository,
  ) {}

  async list(query: QueryAppointmentDto) {
    const limit = query.limit ?? 20;
    const page = query.page ?? 1;

    const { items, totalItems } = await this.repo.findMany({
      status: query.status,
      search: query.search,
      date: query.date,
      skip: paginationSkip(page, limit),
      take: limit,
      orderBy: parseSort(query.sort, SORTABLE_FIELDS, { createdAt: 'desc' }),
    });

    return {
      data: items.map((a: Appointment) => this.toResponse(a)),
      meta: buildPaginationMeta(page, limit, totalItems),
    };
  }

  async findOne(id: string) {
    const item = await this.repo.findById(id);
    if (!item) {
      throw new NotFoundException('Data pendaftaran tidak ditemukan.');
    }
    return this.toResponse(item);
  }

  async create(dto: CreateAppointmentDto) {
    // 1. Verify if registration is currently open in settings
    const regSetting = await this.settingsRepo.getRegistrationSetting();
    if (!regSetting.isOpen) {
      const msg = regSetting.noticeMessage || 'Pendaftaran online saat ini sedang ditutup.';
      throw new BadRequestException(msg);
    }

    // 2. Generate a unique registration reference number (REG-XXXXXX)
    const id = `REG-${Math.floor(100000 + Math.random() * 900000)}`;

    const appointment = await this.repo.create({
      id,
      patientName: dto.patientName,
      phone: dto.phone,
      patientType: dto.patientType,
      paymentMethod: dto.paymentMethod,
      serviceId: dto.serviceId,
      serviceName: dto.serviceName,
      doctorId: dto.doctorId,
      doctorName: dto.doctorName,
      date: new Date(dto.date),
      time: dto.time,
      notes: dto.notes,
      status: dto.status ?? AppointmentStatus.MENUNGGU,
    });

    return this.toResponse(appointment);
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Data pendaftaran tidak ditemukan.');
    }

    const updated = await this.repo.update(id, {
      ...(dto.patientName !== undefined ? { patientName: dto.patientName } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.patientType !== undefined ? { patientType: dto.patientType } : {}),
      ...(dto.paymentMethod !== undefined ? { paymentMethod: dto.paymentMethod } : {}),
      ...(dto.serviceId !== undefined ? { serviceId: dto.serviceId } : {}),
      ...(dto.serviceName !== undefined ? { serviceName: dto.serviceName } : {}),
      ...(dto.doctorId !== undefined ? { doctorId: dto.doctorId } : {}),
      ...(dto.doctorName !== undefined ? { doctorName: dto.doctorName } : {}),
      ...(dto.date !== undefined ? { date: new Date(dto.date) } : {}),
      ...(dto.time !== undefined ? { time: dto.time } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });

    return this.toResponse(updated);
  }

  async remove(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException('Data pendaftaran tidak ditemukan.');
    }
    await this.repo.delete(id);
  }

  private toResponse(appointment: Appointment) {
    const statusMap: Record<string, string> = {
      MENUNGGU: 'Menunggu',
      DIKONFIRMASI: 'Dikonfirmasi',
      SELESAI: 'Selesai',
      BATAL: 'Batal',
    };
    const patientTypeMap: Record<string, string> = {
      BARU: 'baru',
      LAMA: 'lama',
    };
    const paymentMethodMap: Record<string, string> = {
      UMUM: 'umum',
      BPJS: 'bpjs',
      ASURANSI: 'asuransi',
    };

    return {
      id: appointment.id,
      patientName: appointment.patientName,
      phone: appointment.phone,
      patientType: patientTypeMap[appointment.patientType] || appointment.patientType.toLowerCase(),
      paymentMethod: paymentMethodMap[appointment.paymentMethod] || appointment.paymentMethod.toLowerCase(),
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      doctorId: appointment.doctorId,
      doctorName: appointment.doctorName,
      date: appointment.date.toISOString().split('T')[0],
      time: appointment.time,
      notes: appointment.notes,
      status: statusMap[appointment.status] || appointment.status,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    };
  }
}
