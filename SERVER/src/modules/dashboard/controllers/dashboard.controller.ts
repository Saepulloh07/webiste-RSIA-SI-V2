import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { DashboardService } from '../services/dashboard.service';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async stats() {
    const data = await this.dashboardService.getStats();
    return { message: 'Statistik dashboard berhasil diambil.', data };
  }
}
