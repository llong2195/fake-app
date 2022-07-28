import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { DateAudit } from '../../../base/date_audit.entity'

@Entity({ name: 'upload_files' })
export class UploadFile extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  originUrl: string

  @Column()
  thumbUrl: string

  constructor(partial: Partial<UploadFile>) {
    super()
    Object.assign(this, partial)
  }
}
