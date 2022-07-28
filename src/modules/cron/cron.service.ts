import { Injectable, Logger } from '@nestjs/common'
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
} from '@nestjs/schedule'
import { exec } from 'child_process'
import { CronJob } from 'cron'
import { BlogsService } from '../blogs/blogs.service'
@Injectable()
export class CronService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly blogsService: BlogsService,
  ) {}
  private readonly logger = new Logger(CronService.name)

  @Interval(100000)
  handleInterval(): void {
    this.logger.debug('Called every 10 seconds')
    this.schedulerRegistry.getCronJobs().forEach((job, key) => {
      console.log(`${key} - ${job.running}`)
      if (!job.running) {
        this.schedulerRegistry.deleteCronJob(key)
      }
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  backupDb(): void {
    exec(
      `mysqldump -u ${process.env.DATABASE_USERNAME} -p${process.env.DATABASE_PASSWORD} ${process.env.DATABASE_DB_NAME} > ${process.env.DATABASE_DB_NAME}.sql`,
      (err, out, derr) => {
        // console.error(err)
        // console.log(out)
        // console.log(derr)
      },
    )
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  registerCron(name: string, dateTime = Date(), funcRun: any): void {
    const job = new CronJob(
      dateTime,
      () => {
        funcRun()
        console.log(`CronJob : ${name} is running`)
      },
      () => {
        console.log(`CronJob : ${name} is complete`)
      },
    )

    this.schedulerRegistry.addCronJob(`${Date.now()}-${name}`, job)
    job.start()
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  autoAcceptBlog(): void {
    console.log(`Auto Accept Blog `)
    this.blogsService.autoAccept().then(rs => {
      console.log(`accept : `, rs.affected)
    })
  }
}
