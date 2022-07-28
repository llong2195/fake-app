import { Injectable } from '@nestjs/common'
import { CreateBlogLikeDto } from './dto/create-blog-like.dto'
import { BaseService } from '../../base/base.service'
import { BlogLike } from './entities/blog-like.entity'
import { BlogLikeRepository } from './BlogLikeRepository'
import { LoggerService } from '../../logger/custom.logger'
import { DeleteResult } from 'typeorm'

@Injectable()
export class BlogLikeService extends BaseService<BlogLike, BlogLikeRepository> {
  constructor(repository: BlogLikeRepository, logger: LoggerService) {
    super(repository, logger)
  }
  async like(
    createBlogLikeDto: CreateBlogLikeDto,
  ): Promise<BlogLike | DeleteResult> {
    const createBlogLike = new BlogLike(createBlogLikeDto)
    const exist = await this.repository.findOne({
      where: { blogId: createBlogLike.blogId, userId: createBlogLike.userId },
    })
    if (exist) {
      return this.repository.delete({
        blogId: createBlogLike.blogId,
        userId: createBlogLike.userId,
      })
    } else {
      const blogLike = this.store(createBlogLike)
      return blogLike
    }
  }
  // async unlike({ blogId, userId }: { blogId: number; userId: number }) {
  //   return await this.repository
  //     .createQueryBuilder()
  //     .delete()
  //     .where('blogId = :blogId', { blogId: blogId })
  //     .andWhere('userId = :userId', { userId: userId })
  //     .execute()
  // }
}
