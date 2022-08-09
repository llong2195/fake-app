import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
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
  async getReview(): Promise<BaseResponseDto<number>> {
    return new BaseResponseDto<number>('Success', this.appService.getReview())
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/review')
  async updateReview(@Body('version') id: string): Promise<BaseResponseDto<number>> {
    return new BaseResponseDto<number>(
      'Success',
      this.appService.updateReview(+id),
    )
  }

  @Get('/view')
  async getView(): Promise<BaseResponseDto<string>> {
    return new BaseResponseDto<string>('Success', this.appService.getView())
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/view')
  async updateView(@Body('url') url: string): Promise<BaseResponseDto<string>> {
    return new BaseResponseDto<string>(
      'Success',
      this.appService.updateView(url),
    )
  }
}
