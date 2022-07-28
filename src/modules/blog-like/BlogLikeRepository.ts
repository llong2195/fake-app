import { EntityRepository, Repository } from 'typeorm'
import { BlogLike } from './entities/blog-like.entity'

@EntityRepository(BlogLike)
export class BlogLikeRepository extends Repository<BlogLike> {}
