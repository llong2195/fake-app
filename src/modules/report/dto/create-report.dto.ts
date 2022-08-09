import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateReportDto {
  @IsNotEmpty()
  blogId: number

  @IsNotEmpty()
  context: string
}
