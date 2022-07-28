import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { Exclude, Expose } from 'class-transformer'
import { DateAudit } from 'src/base/date_audit.entity'
import { Role } from 'src/constant/role.enum'
import { UploadFile } from '../../upload-file/entities/upload-file.entity'
import { Blog } from '../../blogs/entities/blog.entity'

@Entity({ name: 'users' })
export class User extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number

  @Unique(['email'])
  @Column()
  email: string

  @Column({ name: 'avatarId', nullable: true })
  avatarId: number

  @ManyToOne(
    () => UploadFile,
    uploadfile => uploadfile.id,
    {
      onDelete: 'SET NULL',
      eager: true,
    },
  )
  @JoinColumn({ name: 'avatarId', referencedColumnName: 'id' })
  avatar: UploadFile

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Exclude()
  @Column()
  password: string

  @Column({ length: 6, nullable: true })
  OTP: string

  @Column({ nullable: true })
  walletAddress: string

  @Column({ name: 'role', type: 'enum', default: Role.USER, enum: Role })
  role: Role

  @Column({ default: true })
  isActive: boolean

  @OneToMany(
    () => Blog,
    blog => blog.user,
  )
  blog: Blog[]

  constructor(partial: Partial<User>) {
    super()
    Object.assign(this, partial)
  }

  @Expose()
  get fullName(): string {
    if (this?.firstName && this?.lastName)
      return `${this?.firstName} ${this?.lastName}`
  }
}
