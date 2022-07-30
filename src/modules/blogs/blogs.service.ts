import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { BaseService } from 'src/base/base.service'
import { LoggerService } from 'src/logger/custom.logger'
import { BlogRepository } from './blog.repository'
import { CreateBlogDto } from './dto/create-blog.dto'
import { Blog } from './entities/blog.entity'
import { UploadFileService } from '../upload-file/upload-file.service'
import { UpdateResult, DeleteResult } from 'typeorm'
import { BlogStatus } from 'src/constant/blogStatus.enum'
import { PaginationQueryDto, PaginationResponse } from 'src/base/base.dto'
import { EntityId } from 'typeorm/repository/EntityId'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { BlogLikeService } from '../blog-like/blog-like.service'
import { CreateBlogLikeDto } from '../blog-like/dto/create-blog-like.dto'
import { BlogLike } from '../blog-like/entities/blog-like.entity'

@Injectable()
export class BlogsService extends BaseService<Blog, BlogRepository> {
  constructor(
    repository: BlogRepository,
    logger: LoggerService,
    private readonly uploadFileService: UploadFileService,
    private readonly blogLikeService: BlogLikeService,
  ) {
    super(repository, logger)
  }

  async like(createBlogLikeDto: CreateBlogLikeDto): Promise<{ like: boolean }> {
    const exist = await this.findById(createBlogLikeDto.blogId)
    if (exist) {
      const blogLike = await this.blogLikeService.like(createBlogLikeDto)
      if (blogLike instanceof BlogLike) {
        this.updatenumLike(createBlogLikeDto.blogId, true)
        return { like: true }
      } else if (blogLike instanceof DeleteResult) {
        this.updatenumLike(createBlogLikeDto.blogId, false)
        return { like: false }
      }
    } else {
      throw new HttpException(
        `Not Found BlogId: ${createBlogLikeDto.blogId}`,
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async create(
    createBlogDto: CreateBlogDto,
    userId: number,
  ): Promise<Blog | undefined> {
    const createBlog = new Blog(createBlogDto)
    createBlog.userId = userId

    if (createBlogDto.mediaId) {
      const media = await this.uploadFileService.findById(createBlogDto.mediaId)
      if (!media) {
        throw new HttpException(
          `Not Found MediaId : ${createBlogDto.mediaId} `,
          HttpStatus.BAD_REQUEST,
        )
      } else {
        createBlog.media = media
      }
    }

    const blog = await this.store(createBlog)

    return await this.findById(blog.id)
  }

  async upgrade(
    id: EntityId,
    updateBlogDto: UpdateBlogDto,
  ): Promise<Blog | undefined> {
    const blog = await this.findById(id)
    if (!blog) {
      throw new HttpException(`Not Found Blog : ${id}`, HttpStatus.BAD_REQUEST)
    }

    const updateBlog = new Blog(updateBlogDto)

    if (updateBlogDto.mediaId) {
      const media = await this.uploadFileService.findById(updateBlogDto.mediaId)
      if (!media) {
        throw new HttpException(
          `Not Found MediaId : ${updateBlogDto.mediaId} `,
          HttpStatus.BAD_REQUEST,
        )
      } else {
        updateBlog.media = media
      }
    }

    const update = await this.update(id, updateBlog)
    return update
  }

  async setPublic(id: EntityId): Promise<Blog> {
    return await this.update(id, { status: BlogStatus.APPROVE })
  }

  async setPrivate(id: EntityId): Promise<Blog> {
    return await this.update(id, { status: BlogStatus.CANCEL })
  }

  async softDelete(id: EntityId): Promise<DeleteResult> {
    return this.repository.update(id, { deleted: true })
  }

  async restore(id: EntityId): Promise<Blog> {
    return await this.update(id, { deleted: false })
  }

  async findByIdAndAddnumSeen(id: EntityId): Promise<Blog | undefined> {
    const exist = await this.findById(id)
    if (exist) {
      return await this.update(id, { numSeen: exist.numSeen + 1 })
    }
    return exist
  }

  async updatenumComment(id: EntityId, isAdd = true): Promise<Blog> {
    const exist = await this.findById(id)
    if (exist) {
      return await this.update(id, {
        numComment: exist.numComment + (isAdd ? +1 : -1),
      })
    }
    return exist
  }

  async updatenumLike(id: EntityId, isAdd = true): Promise<Blog> {
    const exist = await this.findById(id)
    if (exist) {
      return await this.update(id, {
        numLike: exist.numLike + (isAdd ? +1 : -1),
      })
    }
    return exist
  }

  async findAll(userId: EntityId, query: PaginationQueryDto): Promise<Blog[]> {
    const { limit = 20, page = 0, keyword, id, sort } = query
    // console.log(query)

    const qb = this.repository.createQueryBuilder('blogs')
    qb.leftJoinAndSelect('blogs.media', 'm')
    qb.leftJoinAndSelect('blogs.user', 'u')
    qb.leftJoinAndMapMany(
      'blogs.liked',
      BlogLike,
      'bloglike',
      'blogs.id = bloglike.blogId and bloglike.userId = :userId',
      { userId },
    )
    if (id) {
      console.log(id)

      qb.andWhere('blogs.id = :id', { id: id })
    }
    if (keyword) {
      qb.andWhere('blogs.title LIKE :title', { title: `%${keyword}%` })
      qb.andWhere('blogs.content LIKE :content', { content: `%${keyword}%` })
    }
    qb.andWhere('blogs.deleted = false')
    qb.skip(limit * page)
      .take(limit)
      .orderBy(sort?.by, sort?.direction)

    const [blogs, total] = await qb.getManyAndCount()
    // console.log(qb.getQuery())
    return blogs
  }

  async getInactiveBlogs(
    userId: EntityId,
    query: PaginationQueryDto,
  ): Promise<Blog[]> {
    const { limit = 20, page = 0, keyword, id, sort } = query
    // console.log(query)

    const qb = this.repository.createQueryBuilder('blogs')
    qb.leftJoinAndSelect('blogs.media', 'm')
    qb.leftJoinAndSelect('blogs.user', 'u')
    // check like
    qb.leftJoinAndMapMany(
      'blogs.liked',
      BlogLike,
      'bloglike',
      'blogs.id = bloglike.blogId and bloglike.userId = :userId',
      { userId },
    )
    
    if (keyword) {
      qb.andWhere('blogs.title LIKE :title', { title: `%${keyword}%` })
      qb.andWhere('blogs.content LIKE :content', { content: `%${keyword}%` })
    }
    qb.andWhere('blogs.deleted = false')
    qb.andWhere('blogs.status = :status', { status: BlogStatus.APPROVE })
    qb.skip(limit * page)
      .take(limit)
      .orderBy(sort?.by, sort?.direction)
      .addOrderBy('blogs.createdAt', 'DESC')

    const [blogs, total] = await qb.getManyAndCount()
    // console.log(qb.getQuery())
    return blogs
  }

  async getBlogsHot(
    userId: EntityId,
    query: PaginationQueryDto,
  ): Promise<Blog[]> {
    const { limit = 20, page = 0, keyword, id, sort } = query
    // console.log(query)

    const qb = this.repository.createQueryBuilder('blogs')
    qb.leftJoinAndSelect('blogs.media', 'm')
    qb.leftJoinAndSelect('blogs.user', 'u')
    // check like
    qb.leftJoinAndMapMany(
      'blogs.liked',
      BlogLike,
      'bloglike',
      'blogs.id = bloglike.blogId and bloglike.userId = :userId',
      { userId },
    )
    if (id) {
      // console.log(id)

      qb.andWhere('blogs.id = :id', { id: id })
    }
    if (keyword) {
      qb.andWhere('blogs.title LIKE :title', { title: `%${keyword}%` })
      qb.andWhere('blogs.content LIKE :content', { content: `%${keyword}%` })
    }
    qb.andWhere('blogs.deleted = false')
    qb.andWhere('blogs.status = :status', { status: BlogStatus.APPROVE })
    qb.skip(limit * page)
      .take(limit)
      .orderBy(sort?.by, sort?.direction)
      .orderBy('blogs.numLike', 'DESC')
      .orderBy('blogs.numSeen', 'DESC')

    const [blogs, total] = await qb.getManyAndCount()
    // console.log(qb.getQuery())
    return blogs
  }

  autoAccept(): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder()
      .update(Blog)
      .set({ status: BlogStatus.APPROVE, numSeen: () => 'numSeen +1' })
      .where('status = :created and status != :approve', {
        created: BlogStatus.CREATED,
        approve: BlogStatus.APPROVE,
      })
      .execute()
  }

  async findBlogsStatusByuserId(
    userId: EntityId,
    status: BlogStatus,
  ): Promise<Blog[]> {
    const [blogs, total] = await this.repository.findAndCount({
      where: { userId: userId, status: status },
    })
    return blogs
  }
}
