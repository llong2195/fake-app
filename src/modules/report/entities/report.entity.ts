import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DateAudit } from '../../../base/date_audit.entity'
import { Blog } from '../../blogs/entities/blog.entity'
import { User } from '../../users/entities/user.entity'

@Entity({ name: 'report' })
export class Report extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'blogId', nullable: true })
  blogId: number

  @Column({ name: 'userId', nullable: true })
  userId: number

  @Column({ nullable: true })
  context: string

  @ManyToOne(
    () => Blog,
    blog => blog.id,
    {
      onDelete: 'SET NULL',
      eager: true,
    },
  )
  @JoinColumn({ name: 'blogId', referencedColumnName: 'id' })
  blog: Blog

  @ManyToOne(
    () => User,
    user => user.id,
    {
      onDelete: 'SET NULL',
      eager: true,
    },
  )
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User

  constructor(partial: Partial<Report>) {
    super()
    Object.assign(this, partial)
  }
}
