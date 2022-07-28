import { Module } from '@nestjs/common'
import { UserModule } from './user.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from '../../logger/custom.logger'
import { BlogsModule } from '../blogs/blogs.module'
import { UploadFileModule } from '../upload-file/upload-file.module'
import { NodemailerModule } from '../nodemailer/nodemailer.module'

@Module({
  imports: [
    UserModule,
    ConfigService,
    LoggerService,
    BlogsModule,
    UploadFileModule,
    NodemailerModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserHttpModule {}
