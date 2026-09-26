import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { MediaService } from '../services/media.service';
import { QueryMediaDto } from '../dto/query-media.dto';
import { UploadMediaDto } from '../dto/upload-media.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @Get()
  async list(@Query() query: QueryMediaDto) {
    const { data, meta } = await this.mediaService.list(query);
    return { message: 'Daftar media berhasil diambil.', data, meta };
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadMediaDto) {
    const data = await this.mediaService.upload(file, dto);
    return { message: 'Media berhasil diunggah.', data };
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.mediaService.remove(id);
    return { message: 'Media berhasil dihapus.', data: null };
  }
}
