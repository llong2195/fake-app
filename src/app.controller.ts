import { Controller, Get, Put, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { Role } from './constant/role.enum'
import { Roles } from './modules/auth/decorator/role.decorator'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RolesGuard } from './modules/auth/guards/role.guard'
import { BaseResponseDto } from './base/base.dto'

@Controller('app')
export class AppController {
  constructor(private appService: AppService) {}
  @Get('/review')
  async getReview(): Promise<BaseResponseDto<boolean>> {
    return new BaseResponseDto<boolean>('Success', this.appService.getReview())
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/review')
  async updateReview(): Promise<BaseResponseDto<boolean>> {
    return new BaseResponseDto<boolean>(
      'Success',
      this.appService.updateReview(),
    )
  }
}
