import { Module } from '@nestjs/common'
import { CronService } from './cron.service'
import { CronController } from './cron.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { BlogsModule } from '../blogs/blogs.module'

@Module({
  imports: [ScheduleModule.forRoot(), BlogsModule],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule {}
