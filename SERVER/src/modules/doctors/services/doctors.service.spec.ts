import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsRepository } from '../repositories/doctors.repository';
import { DoctorStatus } from '@prisma/client';

describe('DoctorsService', () => {
  let service: DoctorsService;
  let repo: Partial<Record<keyof DoctorsRepository, jest.Mock>>;

  const mockDoctor = {
    id: BigInt(1),
    name: 'dr. Budi Santoso, Sp.A',
    slug: 'dr-budi-santoso-spa',
    specialty: 'Anak',
    subspecialty: null,
    status: DoctorStatus.AKTIF,
    schedule: 'Senin & Rabu, 09:00 - 12:00',
    sipNumber: null,
    poliklinik: null,
    imageUrl: null,
    bio: null,
    education: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = {
      findMany: jest.fn(),
      findBySlugOrId: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorsService, { provide: DoctorsRepository, useValue: repo }],
    }).compile();

    service = module.get<DoctorsService>(DoctorsService);
  });

  it('lists doctors with pagination meta', async () => {
    (repo.findMany as jest.Mock).mockResolvedValue({ items: [mockDoctor], totalItems: 1 });

    const result = await service.list({ page: 1, limit: 10 } as any);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe('1');
    expect(result.meta.totalItems).toBe(1);
  });

  it('throws NotFoundException when a doctor slug/id does not exist', async () => {
    (repo.findBySlugOrId as jest.Mock).mockResolvedValue(null);

    await expect(service.findOne('unknown-doctor')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a doctor with a generated unique slug', async () => {
    (repo.findBySlug as jest.Mock).mockResolvedValue(null);
    (repo.create as jest.Mock).mockResolvedValue(mockDoctor);

    const result = await service.create({
      name: 'dr. Budi Santoso, Sp.A',
      specialty: 'Anak',
      schedule: 'Senin & Rabu, 09:00 - 12:00',
    } as any);

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ slug: 'dr-budi-santoso-spa' }));
    expect(result.slug).toBe('dr-budi-santoso-spa');
  });

  it('appends a numeric suffix when the generated slug already exists', async () => {
    (repo.findBySlug as jest.Mock).mockResolvedValueOnce(mockDoctor).mockResolvedValueOnce(null);
    (repo.create as jest.Mock).mockResolvedValue({ ...mockDoctor, slug: 'dr-budi-santoso-spa-1' });

    await service.create({
      name: 'dr. Budi Santoso, Sp.A',
      specialty: 'Anak',
      schedule: 'Senin & Rabu, 09:00 - 12:00',
    } as any);

    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ slug: 'dr-budi-santoso-spa-1' }));
  });

  it('removes a doctor when it exists', async () => {
    (repo.findById as jest.Mock).mockResolvedValue(mockDoctor);
    (repo.delete as jest.Mock).mockResolvedValue(mockDoctor);

    await service.remove('1');

    expect(repo.delete).toHaveBeenCalledWith(BigInt(1));
  });
});
