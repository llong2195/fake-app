import { Controller } from '@nestjs/common'
import { CronService } from './cron.service'

@Controller('v1/cron')
export class CronController {
  constructor(private readonly cronService: CronService) {}
}
