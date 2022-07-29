import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { User } from '../users/entities/user.entity'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { UserService } from '../users/user.service'
import { AuthUser } from '../../decorators/auth.user.decorator'
import { AuthUserDto, BaseResponseDto } from 'src/base/base.dto'
import { LoginRequestDto } from './dto/login-request.dto'
import { RegisterRequestDto } from './dto/register-request.dto'
import { forgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password-dto'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() request: LoginRequestDto): Promise<BaseResponseDto<any>> {
    const data = await this.authService.login(request)
    return new BaseResponseDto<any>('Success', plainToClass(User, data))
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my-profile')
  async myProfile(
    @AuthUser() authUser: AuthUserDto,
  ): Promise<BaseResponseDto<User>> {
    const user = await this.userService.findById(authUser.id)
    return new BaseResponseDto<User>('Success', plainToClass(User, user))
  }

  @Post('/register')
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<BaseResponseDto<User>> {
    const user = await this.userService.store(registerRequestDto)

    return new BaseResponseDto<User>('Success', plainToClass(User, user))
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPassword: forgotPasswordDto,
  ): Promise<BaseResponseDto<any>> {
    this.authService.sendOtp(forgotPassword)
    return new BaseResponseDto<any>('Success', null)
  }

  @Post('/reset-password')
  async verifyOtp(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<BaseResponseDto<User>> {
    console.log(resetPasswordDto)

    const user = await this.authService.verifyAndResetPassword(resetPasswordDto)
    return new BaseResponseDto<User>('Success', user)
  }
}
