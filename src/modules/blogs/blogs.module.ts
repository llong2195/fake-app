import { Module } from '@nestjs/common'
import { BlogsService } from './blogs.service'
import { BlogsController } from './blogs.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BlogRepository } from './blog.repository'
import { UploadFileModule } from '../upload-file/upload-file.module'
import { CommentModule } from '../comment/comment.module'
import { BlogLikeModule } from '../blog-like/blog-like.module'

@Module({
  controllers: [BlogsController],
  imports: [
    TypeOrmModule.forFeature([BlogRepository]),
    UploadFileModule,
    CommentModule,
    BlogLikeModule,
  ],
  providers: [BlogsService],
  exports: [TypeOrmModule, BlogsService],
})
export class BlogsModule {}
