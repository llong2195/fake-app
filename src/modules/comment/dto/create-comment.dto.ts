import { IsNotEmpty } from 'class-validator'

export class CreateCommentDto {
  @IsNotEmpty()
  context: string

  @IsNotEmpty()
  blogId: number
}
