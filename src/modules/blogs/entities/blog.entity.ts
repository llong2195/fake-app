import { DateAudit } from 'src/base/date_audit.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { UploadFile } from '../../upload-file/entities/upload-file.entity'
import { BlogStatus } from 'src/constant/blogStatus.enum'

@Entity({ name: 'blogs' })
export class Blog extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column('text')
  description: string

  @Column({ type: 'longtext' })
  content: string

  @Column({ name: 'mediaId', nullable: true })
  mediaId: number

  @Column({ default: 0, nullable: true })
  numSeen: number

  @Column({ default: 0, nullable: true })
  numLike: number

  @Column({ default: 0, nullable: true })
  numComment: number

  @ManyToOne(
    () => UploadFile,
    uploadfile => uploadfile.id,
    {
      onDelete: 'RESTRICT',
      eager: true,
    },
  )
  @JoinColumn({ name: 'mediaId', referencedColumnName: 'id' })
  media: UploadFile

  @Column({ name: 'userId', nullable: true })
  userId: number

  @Column({
    name: 'status',
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.CREATED,
  })
  status: BlogStatus

  @ManyToOne(
    () => User,
    user => user.id,
    {
      onDelete: 'RESTRICT',
    },
  )
  @JoinColumn({ name: 'userId' })
  user: User

  constructor(partial: Partial<Blog>) {
    super()
    Object.assign(this, partial)
  }
}
