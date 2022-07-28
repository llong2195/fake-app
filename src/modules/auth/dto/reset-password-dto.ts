import { Type } from 'class-transformer'
import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator'
import { PasswordConfirmValidator } from '../../../validators/password-confirm.validator'

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @Type(() => Number)
  otp: number

  @IsNotEmpty({ message: 'password is not empty' })
  @Length(8, 24, { message: 'password invalid' })
  password: string

  @IsNotEmpty({ message: 'password confirmation is not empty' })
  @Validate(PasswordConfirmValidator, ['password'], {
    message: 'password confirmation invalid',
  })
  passwordConfirmation: string
}
