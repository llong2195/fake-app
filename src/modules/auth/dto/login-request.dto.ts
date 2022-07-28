import { IsNotEmpty } from 'class-validator'

export class LoginRequestDto {
  @IsNotEmpty({ message: 'content is not empty' })
  email: string
  @IsNotEmpty({ message: 'content is not empty' })
  password: string
}
