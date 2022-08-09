import { Module } from '@nestjs/common'
import { ReportService } from './report.service'
import { ReportController } from './report.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReportRepository } from './report.repository'
import { BlogsModule } from '../blogs/blogs.module'

@Module({
  imports: [TypeOrmModule.forFeature([ReportRepository]), BlogsModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [TypeOrmModule, ReportService],
})
export class ReportModule {}
