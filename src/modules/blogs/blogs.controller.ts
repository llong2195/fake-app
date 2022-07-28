import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard'
import {
  AuthUserDto,
  BaseResponseDto,
  PaginationResponse,
} from 'src/base/base.dto'
import { AuthUser } from 'src/decorators/auth.user.decorator'
import { BlogsService } from './blogs.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { Blog } from './entities/blog.entity'
import { PaginationQueryDto } from '../../base/base.dto'
import { plainToClass } from 'class-transformer'
import { EntityId } from 'typeorm/repository/EntityId'
import { CommentService } from '../comment/comment.service'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Roles } from '../auth/decorator/role.decorator'
import { Role } from 'src/constant/role.enum'
import { DeleteResult } from 'typeorm'
import { RolesGuard } from '../auth/guards/role.guard'
import { Comment } from '../comment/entities/comment.entity'
import { CreateBlogLikeDto } from '../blog-like/dto/create-blog-like.dto'

@Controller('v1/blogs')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  async create(
    @AuthUser() authUser: AuthUserDto,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<BaseResponseDto<Blog>> {
    const blog = await this.blogsService.create(createBlogDto, authUser.id)
    return new BaseResponseDto<Blog>('Success', blog)
  }

  @Roles(Role.ADMIN)
  @Get()
  async index(
    @Query() query: PaginationQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<Blog[]>>> {
    const blogs = await this.blogsService.findAll(query)
    return new BaseResponseDto<PaginationResponse<Blog[]>>('Success', blogs)
  }

  @Get('/inactive')
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<Blog[]>>> {
    const blogs = await this.blogsService.getInactiveBlogs(query)
    return new BaseResponseDto<PaginationResponse<Blog[]>>('Success', blogs)
  }

  @Get('/hot')
  async findBlogHot(
    @Query() query: PaginationQueryDto,
  ): Promise<BaseResponseDto<PaginationResponse<Blog[]>>> {
    const blogs = await this.blogsService.getBlogsHot(query)
    return new BaseResponseDto<PaginationResponse<Blog[]>>('Success', blogs)
  }

  @Get(':id')
  async findOne(@Param('id') id: EntityId): Promise<BaseResponseDto<Blog>> {
    const blog = await this.blogsService.findByIdAndAddnumSeen(+id)
    return new BaseResponseDto<Blog>('Success', blog)
  }

  @Get(':id/comment')
  async findComment(
    @Param('id') id: EntityId,
  ): Promise<BaseResponseDto<Comment[]>> {
    const comments = await this.commentService.getCommentByBlogId(id)
    return new BaseResponseDto<Comment[]>(
      'Success',
      plainToClass(Comment, comments),
    )
  }

  @Post(':id/like')
  async like(
    @Param('id') id: EntityId,
    @AuthUser() authUser: AuthUserDto,
  ): Promise<BaseResponseDto<Blog | DeleteResult>> {
    const createBlogLikeDto = new CreateBlogLikeDto()
    createBlogLikeDto.blogId = <number>id
    createBlogLikeDto.userId = authUser.id
    const blog = await this.blogsService.like(createBlogLikeDto)
    return new BaseResponseDto<Blog | DeleteResult>(
      'Success',
      plainToClass(Blog, blog),
    )
  }

  @Patch(':id')
  async update(
    @Param('id') id: EntityId,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BaseResponseDto<Blog>> {
    const blog = await this.blogsService.upgrade(id, updateBlogDto)
    return new BaseResponseDto<Blog>('Success', plainToClass(Blog, blog))
  }

  @Roles(Role.ADMIN)
  @Post(':id/setPublic')
  async setPublic(@Param('id') id: number): Promise<BaseResponseDto<Blog>> {
    const blog = await this.blogsService.setPublic(id)
    return new BaseResponseDto<Blog>('Success', blog)
  }

  @Roles(Role.ADMIN)
  @Post(':id/setPrivate')
  async setPrivate(@Param('id') id: number): Promise<BaseResponseDto<Blog>> {
    const blog = await this.blogsService.setPrivate(id)
    return new BaseResponseDto<Blog>('Success', blog)
  }

  @Delete(':id')
  async softDelete(
    @Param('id') id: EntityId,
  ): Promise<BaseResponseDto<DeleteResult>> {
    await this.blogsService.softDelete(id)
    return new BaseResponseDto<DeleteResult>('Success', null)
  }

  @Roles(Role.ADMIN)
  @Patch(':id/restore')
  async restore(@Param('id') id: EntityId): Promise<BaseResponseDto<Blog>> {
    const blog = await this.blogsService.restore(id)
    return new BaseResponseDto<Blog>('Success', blog)
  }

  @Roles(Role.ADMIN)
  @Delete(':id/destroy')
  async destroy(
    @Param('id') id: EntityId,
  ): Promise<BaseResponseDto<DeleteResult>> {
    await this.blogsService.delete(id)
    return new BaseResponseDto<DeleteResult>('Success', null)
  }
}
