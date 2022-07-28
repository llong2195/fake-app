import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DateAudit } from '../../../base/date_audit.entity'
import { User } from '../../users/entities/user.entity'
import { Blog } from '../../blogs/entities/blog.entity'

@Entity({ name: 'comment' })
export class Comment extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  context: string

  @Column({ name: 'userId' })
  userId: number

  @ManyToOne(
    () => User,
    user => user.id,
    { onDelete: 'RESTRICT', eager: true },
  )
  @JoinColumn({ name: 'userId' })
  user: User

  @Column({ name: 'blogId' })
  blogId: number

  @ManyToOne(
    () => Blog,
    blog => blog.id,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'blogId' })
  blog: Blog

  constructor(partial: Partial<Comment>) {
    super()
    Object.assign(this, partial)
  }
}
