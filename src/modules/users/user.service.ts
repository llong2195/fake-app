import { User } from './entities/user.entity'
import { UserRepository } from './user.repository'
import {
  Injectable,
  HttpException,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { BaseService } from '../../base/base.service'
import { LoggerService } from '../../logger/custom.logger'
import { EntityId } from 'typeorm/repository/EntityId'
import { BlogsService } from '../blogs/blogs.service'
import { Blog } from '../blogs/entities/blog.entity'
import { PaginationResponse } from 'src/base/base.dto'
import { BlogStatus } from 'src/constant/blogStatus.enum'
import { UpdateUserDto } from './dto/update-user.dto'
import { UploadFileService } from '../upload-file/upload-file.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { forgotPasswordDto } from '../auth/dto/forgot-password.dto'
import { ConfigService } from '@nestjs/config'
import { Transporter, createTransport } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { NodemailerService } from '../nodemailer/nodemailer.service'

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>
  constructor(
    repository: UserRepository,
    logger: LoggerService,
    private blogsService: BlogsService,
    private uploadFileService: UploadFileService,
    private readonly configService: ConfigService,
    private nodemailerService: NodemailerService,
  ) {
    super(repository, logger)
  }

  async upgrade(userId: EntityId, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUser = new User(updateUserDto)
    const checkAvatar = await this.uploadFileService.findById(
      updateUserDto?.avatarId,
    )
    if (!checkAvatar) {
      throw new HttpException(
        `Not Found AvatarId : ${updateUserDto.avatarId}`,
        HttpStatus.BAD_REQUEST,
      )
    }
    updateUser.avatar = checkAvatar
    return await this.update(userId, updateUser)
  }

  async changePassword(
    userId: EntityId,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    return this.update(userId, { password: changePasswordDto.password })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email: email })
  }

  getInactiveUsers(): Promise<User[]> {
    return this.repository.getInactiveUsers()
  }

  findBlogsAccepted(userId: EntityId): Promise<PaginationResponse<Blog>> {
    return this.blogsService.findBlogsStatusByuserId(userId, BlogStatus.APPROVE)
  }

  findBlogsCreated(userId: EntityId): Promise<PaginationResponse<Blog>> {
    return this.blogsService.findBlogsStatusByuserId(userId, BlogStatus.CANCEL)
  }

  async createOtp(forgotPasswordDto: forgotPasswordDto): Promise<User> {
    const OTP_LENGTH = Number(this.configService.get<number>('OTP_LENGTH'))

    const otp = Math.random()
      .toString()
      .trim()
      .substring(2, OTP_LENGTH + 2)
    // console.log(forgotPasswordDto)
    const exist = await this.findByEmail(forgotPasswordDto.email)
    if (!exist) {
      throw new HttpException(
        `Not Found email : ${forgotPasswordDto.email}`,
        HttpStatus.BAD_REQUEST,
      )
    }
    await this.repository.update(exist.id, { OTP: otp })

    const user = await this.findById(exist.id)
    return user
  }

  async removeOtp(id: EntityId): Promise<User> {
    return await this.update(id, { OTP: null })
  }

  async verifyOtp(email: string, otp: number): Promise<User> {
    const user = await this.repository.findOne({
      where: { OTP: otp, email: email },
    })
    console.log(user)
    console.log(otp)

    return user
  }
}
