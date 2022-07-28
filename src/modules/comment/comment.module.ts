import { forwardRef, Module } from '@nestjs/common'
import { CommentService } from './comment.service'
import { CommentController } from './comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentRepository } from './comment.repository'
import { BlogsModule } from '../blogs/blogs.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository]),
    forwardRef(() => BlogsModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
