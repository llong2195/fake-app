import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthUser } from 'src/decorators/auth.user.decorator'
import { CommentService } from './comment.service'
import { AuthUserDto, BaseResponseDto } from '../../base/base.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { plainToClass } from 'class-transformer'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { EntityId } from 'typeorm/repository/EntityId'
import { DeleteResult } from 'typeorm'
import { Comment } from './entities/comment.entity'
import { RolesGuard } from '../auth/guards/role.guard'
import { Roles } from '../auth/decorator/role.decorator'
import { Role } from 'src/constant/role.enum'

@Controller('v1/comment')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @AuthUser() user: AuthUserDto,
  ): Promise<BaseResponseDto<Comment>> {
    const comment = await this.commentService.create(user.id, createCommentDto)
    return new BaseResponseDto<Comment>(
      'Success',
      plainToClass(Comment, comment),
    )
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<BaseResponseDto<Comment[]>> {
    const comments = await this.commentService.index()
    return new BaseResponseDto<Comment[]>('Success', comments)
  }

  @Get(':id')
  async findOne(@Param('id') id: EntityId): Promise<BaseResponseDto<Comment>> {
    const comment = await this.commentService.findById(id)
    return new BaseResponseDto<Comment>('Success', comment)
  }

  @Patch(':id')
  async updateComment(
    @Param('id') id: EntityId,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<BaseResponseDto<Comment>> {
    const comment = await this.commentService.update(id, updateCommentDto)
    return new BaseResponseDto<Comment>('Success', comment)
  }

  @Delete(':id')
  async delete(
    @Param('id') id: EntityId,
  ): Promise<BaseResponseDto<DeleteResult>> {
    await this.commentService.deleleAndUpdatenumComment(id)
    return new BaseResponseDto<DeleteResult>('Success', null)
  }
}
