import { EntityRepository, Repository } from 'typeorm'
import { UploadFile } from './entities/upload-file.entity'

@EntityRepository(UploadFile)
export class UploadFileRepository extends Repository<UploadFile> {}
