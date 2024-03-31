import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Role } from '../../../auth/guards/role.enum';
import { Roles } from '../../../auth/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'Express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Roles(Role.admin)
  @Get('all')
  async fileList(@Req() req: Request) {
    return await this.filesService.getAllFiles(req);
  }

  @Get(':id')
  async imageDisplay(
    @Req() req: Request,
    @Param('id') id: number,
    @Res() res: Response,
    @Query('quality') quality: number = 100,
  ) {
    quality = quality ? quality : 100;

    return await this.filesService.imageDisplay(req, res, id, quality);
  }

  @Roles(Role.admin)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: '.(png|jpeg|jpg)',
          }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // limit total size to 10MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return await this.filesService.sendToServer(file, req);
  }
}
