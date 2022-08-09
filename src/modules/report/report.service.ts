import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { CreateReportDto } from './dto/create-report.dto'
import { UpdateReportDto } from './dto/update-report.dto'
import { BaseService } from '../../base/base.service'
import { Report } from './entities/report.entity'
import { ReportRepository } from './report.repository'
import { LoggerService } from '../../logger/custom.logger'
import { BlogsService } from '../blogs/blogs.service'
import { EntityId } from 'typeorm/repository/EntityId'

@Injectable()
export class ReportService extends BaseService<Report, ReportRepository> {
  constructor(
    repository: ReportRepository,
    logger: LoggerService,
    private readonly blogsService: BlogsService,
  ) {
    super(repository, logger)
  }

  async create(
    createReportDto: CreateReportDto,
    userId: number,
  ): Promise<Report> {
    const createReport = new Report(createReportDto)
    createReport.userId = userId

    const blog = await this.blogsService.findById(createReport.blogId)
    if (!blog) {
      throw new HttpException('Not Found BlogId', HttpStatus.BAD_REQUEST)
    }

    const report = await this.store(createReport)
    return this.findById(report.id)
  }

  async softDelete(id: EntityId): Promise<Report> {
    return await this.update(id, { deleted: true })
  }

}
