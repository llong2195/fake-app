import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { ReportService } from './report.service'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { BaseResponseDto, AuthUserDto } from '../../base/base.dto';
import { Report } from './entities/report.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { DeleteResult } from 'typeorm/index'
import { RolesGuard } from '../auth/guards/role.guard'
import { Roles } from '../auth/decorator/role.decorator'
import { Role } from 'src/constant/role.enum'
import { AuthUser } from 'src/decorators/auth.user.decorator'

@Controller('report')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(
    @Body() createReportDto: CreateReportDto,
    @AuthUser() authUser: AuthUserDto
  ): Promise<BaseResponseDto<Report>> {
    const report = await this.reportService.create(createReportDto, authUser.id)
    return new BaseResponseDto<Report>('Success', report)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<BaseResponseDto<Report[]>> {
    const reports = await this.reportService.index()
    return new BaseResponseDto<Report[]>('Success', reports)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<Report>> {
    const report = await this.reportService.findById(+id)
    return new BaseResponseDto<Report>('Success', report)
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<DeleteResult>> {
    await this.reportService.delete(+id)
    return new BaseResponseDto<DeleteResult>('Success', null)
  }
}
