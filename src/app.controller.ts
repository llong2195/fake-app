import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { Role } from './constant/role.enum'
import { Roles } from './modules/auth/decorator/role.decorator'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'
import { RolesGuard } from './modules/auth/guards/role.guard'
import { MobileResponseDto } from './base/base.dto'

@Controller('app')
export class AppController {
  constructor(private appService: AppService) {}
  @Get('/review')
  async getReview(): Promise<MobileResponseDto<number>> {
    const review = this.appService.getReview()
    return new MobileResponseDto<number>('Success', review.Android, review.IOS)
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/review')
  async updateReview(
    @Body('versionAndroid') verAndroid: number,
    @Body('versionIOS') verIOS: number,
  ): Promise<MobileResponseDto<number>> {
    const update = this.appService.updateReview(verAndroid, verIOS)
    return new MobileResponseDto<number>('Success', update.Android, update.IOS)
  }

  @Get('/view')
  async getView(): Promise<MobileResponseDto<string>> {
    const view = this.appService.getView()
    return new MobileResponseDto<string>('Success', view.url, view.url_ios)
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Put('/view')
  async updateView(
    @Body('urlAndroid') urlAndroid: string,
    @Body('urlIOS') urlIOS: string,
  ): Promise<MobileResponseDto<string>> {
    const update = this.appService.updateView(urlAndroid, urlIOS)
    return new MobileResponseDto<string>(
      'Success',
      update.url,
      update.url_ios
    )
  }
}
