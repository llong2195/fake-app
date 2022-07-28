import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common'
import { UploadFileService } from './upload-file.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BaseResponseDto, AuthUserDto } from '../../base/base.dto'
import { UploadFile } from './entities/upload-file.entity'
import { plainToClass } from 'class-transformer'
import { Role } from 'src/constant/role.enum'
import { Roles } from '../auth/decorator/role.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '@config/multer.config'
import { AuthUser } from 'src/decorators/auth.user.decorator'
import { Request } from 'express'
import { DeleteResult } from 'typeorm/index'
import { RolesGuard } from '../auth/guards/role.guard'

@Controller('v1/upload-file')
export class UploadFileController {
  constructor(private readonly uploadFileService: UploadFileService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @Post()
  async create(
    @AuthUser() authUser: AuthUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<BaseResponseDto<UploadFile>> {
    console.log(`${req.protocol}://${req.get('Host')}`)
    const uploadfile = await this.uploadFileService.uploadFile(
      authUser.id,
      file,
      `${req.protocol}://${req.get('Host')}`,
    )
    return new BaseResponseDto<UploadFile>(
      'Success',
      plainToClass(UploadFile, uploadfile),
    )
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<BaseResponseDto<UploadFile[]>> {
    const files = await this.uploadFileService.index()
    return new BaseResponseDto<UploadFile[]>(
      'Success',
      plainToClass(UploadFile, files),
    )
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BaseResponseDto<UploadFile>> {
    const file = await this.uploadFileService.findById(+id)
    return new BaseResponseDto<UploadFile>(
      'Success',
      plainToClass(UploadFile, file),
    )
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<BaseResponseDto<DeleteResult>> {
    await this.uploadFileService.delete(+id)
    return new BaseResponseDto<DeleteResult>('Success', null)
  }
}
