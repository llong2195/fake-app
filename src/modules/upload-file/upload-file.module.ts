import { Module } from '@nestjs/common'
import { UploadFileService } from './upload-file.service'
import { UploadFileController } from './upload-file.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UploadFileRepository } from './upload-file.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UploadFileRepository])],
  controllers: [UploadFileController],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
