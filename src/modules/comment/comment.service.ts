import { Injectable } from '@nestjs/common'
import { CreateCommentDto } from './dto/create-comment.dto'
import { BaseService } from '../../base/base.service'
import { CommentRepository } from './comment.repository'
import { Comment } from './entities/comment.entity'
import { LoggerService } from '../../logger/custom.logger'
import { EntityId } from 'typeorm/repository/EntityId'
import { BlogsService } from '../blogs/blogs.service'
import { Blog } from '../blogs/entities/blog.entity'
import { DeleteResult } from 'typeorm'

@Injectable()
export class CommentService extends BaseService<Comment, CommentRepository> {
  constructor(
    repository: CommentRepository,
    logger: LoggerService,
    private readonly blogsService: BlogsService,
  ) {
    super(repository, logger)
  }

  async create(
    userId: EntityId,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const createComment = new Comment(createCommentDto)
    createComment.userId = <number>userId

    const comment = await this.store(createComment)
    if (comment) {
      await this.blogsService.updatenumComment(createComment.blogId, true)
    }
    return comment
  }

  async getCommentByBlogId(blogId: EntityId): Promise<Comment[]> {
    return await this.repository.find({ where: { blogId: blogId } })
  }

  async deleleAndUpdatenumComment(id: EntityId): Promise<DeleteResult> {
    const exist = await this.findById(id)
    if (exist) {
      this.blogsService.updatenumComment(exist.blogId, false)
    }
    return this.delete(id)
  }
}
