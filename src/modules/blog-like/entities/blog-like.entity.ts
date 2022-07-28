import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { DateAudit } from '../../../base/date_audit.entity'
import { User } from '../../users/entities/user.entity'
import { Blog } from '../../blogs/entities/blog.entity'

@Entity({ name: 'blog_like' })
export class BlogLike extends DateAudit {
  @PrimaryColumn({ name: 'blogId' })
  blogId: number

  @PrimaryColumn({ name: 'userId' })
  userId: number

  @ManyToOne(
    () => Blog,
    blog => blog.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'blogId' })
  blog: Blog

  @ManyToOne(
    () => User,
    User => User.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'userId' })
  User: User
  constructor(partial: Partial<BlogLike>) {
    super()
    Object.assign(this, partial)
  }
}
