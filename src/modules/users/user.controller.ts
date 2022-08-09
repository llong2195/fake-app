import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { EntityId } from 'typeorm/repository/EntityId'
import { plainToClass } from 'class-transformer'
import { UpdateUserDto } from './dto/update-user.dto'
import { DeleteResult } from 'typeorm/index'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BaseResponseDto } from 'src/base/base.dto'
import { RolesGuard } from '../auth/guards/role.guard'
import { Roles } from '../auth/decorator/role.decorator'
import { Role } from 'src/constant/role.enum'
import { AuthUser } from 'src/decorators/auth.user.decorator'
import { AuthUserDto, PaginationResponse } from '../../base/base.dto'
import { Blog } from '../blogs/entities/blog.entity'
import { ChangePasswordDto } from './dto/change-password.dto'
import { AdminCreateUserDto } from './dto/admin-create-user.dto'
import { AdminUpdateUserDto } from './dto/admin-update-user.dto'
import { HttpStatus } from '@nestjs/common'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('v1/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  /////// USER
  @Delete('/delete')
  async removeAccount(@AuthUser() authUser: AuthUserDto) {
    const user = await this.userService.removeAccount(authUser.id)
    return new BaseResponseDto<User>('Success', user)
  }

  @Get('my-profile')
  async myProfile(
    @AuthUser() authUser: AuthUserDto,
  ): Promise<BaseResponseDto<User>> {
    const user = await this.userService.findById(authUser.id)
    return new BaseResponseDto<User>('Success', user)
  }

  @Patch('update-profile')
  async updateProfile(
    @AuthUser() authUser: AuthUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto<User>> {
    const updateUser = await this.userService.upgrade(
      authUser.id,
      updateUserDto,
    )
    return new BaseResponseDto<User>('Success', updateUser)
  }

  @Patch('change-password')
  async changePassword(
    @AuthUser() authUser: AuthUserDto,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<BaseResponseDto<User>> {
    const updateUser = await this.userService.changePassword(
      authUser.id,
      changePasswordDto,
    )
    return new BaseResponseDto<User>('Success', updateUser)
  }

  @Get('/blog-accept')
  async getBlogsAccepted(
    @AuthUser() authUser: AuthUserDto,
  ): Promise<BaseResponseDto<Blog[]>> {
    const blogs = await this.userService.findBlogsAccepted(authUser.id)
    return new BaseResponseDto<Blog[]>('Success', blogs)
  }

  @Get('/blog-create')
  async getBlogsCreated(
    @AuthUser() authUser: AuthUserDto,
  ): Promise<BaseResponseDto<Blog[]>> {
    const blogs = await this.userService.findBlogsAccepted(authUser.id)
    return new BaseResponseDto<Blog[]>('Success', blogs)
  }

  /////// ADMIN
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async index(): Promise<BaseResponseDto<User[]>> {
    const users = await this.userService.index()
    return new BaseResponseDto<User[]>('Success', users)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/inactive')
  async getInactiveUser(): Promise<BaseResponseDto<User[]>> {
    const users = await this.userService.getInactiveUsers()
    return new BaseResponseDto<User[]>('Success', users)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/:id')
  async show(@Param('id') id: EntityId): Promise<BaseResponseDto<User>> {
    const user = await this.userService.findById(id)
    if (!user) {
      throw new NotFoundException()
    }
    return new BaseResponseDto<User>('Success', user)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(
    @Body() userData: AdminCreateUserDto,
  ): Promise<BaseResponseDto<User>> {
    const createdUser = await this.userService.store(userData)
    return new BaseResponseDto<User>('Success', plainToClass(User, createdUser))
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('/:id')
  async update(
    @Param('id') id: EntityId,
    @Body() userData: AdminUpdateUserDto,
  ): Promise<BaseResponseDto<User>> {
    const createdUser = await this.userService.update(id, userData)
    return new BaseResponseDto<User>('Success', plainToClass(User, createdUser))
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete('/:id')
  async destroy(
    @Param('id') id: EntityId,
  ): Promise<BaseResponseDto<DeleteResult>> {
    await this.userService.delete(id)
    return new BaseResponseDto<DeleteResult>('Success', null)
  }
}
