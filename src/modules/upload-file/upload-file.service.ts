import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { BaseService } from '../../base/base.service'
import { UploadFile } from './entities/upload-file.entity'
import { UploadFileRepository } from './upload-file.repository'
import { LoggerService } from '../../logger/custom.logger'
import { EntityId } from 'typeorm/repository/EntityId'
import * as sharp from 'sharp'
import { Request } from 'express'

@Injectable()
export class UploadFileService extends BaseService<
  UploadFile,
  UploadFileRepository
> {
  constructor(repository: UploadFileRepository, logger: LoggerService) {
    super(repository, logger)
  }
  async uploadFile(
    userId: EntityId,
    file: Express.Multer.File,
    serverUrl: string,
  ): Promise<UploadFile> {
    if (!file) {
      throw new HttpException(`file is not null`, HttpStatus.BAD_REQUEST)
    }
    const createUploadFile = new UploadFile(null)
    createUploadFile.originUrl = `image/${file.filename}`
    // console.log(file)

    await sharp(file.path)
      .resize({
        width: 317,
        height: 262,
      })
      .toFile('public/image/' + '262x317-' + file.filename)
      .then(() => {
        createUploadFile.thumbUrl = 'image/262x317-' + file.filename
      })
      .catch(err => {
        console.log(err)

        throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST)
      })
    return this.store(createUploadFile)
  }
}
