import { PartialType } from '@nestjs/mapped-types'
import { CreateBlogLikeDto } from './create-blog-like.dto'

export class UpdateBlogLikeDto extends PartialType(CreateBlogLikeDto) {}
