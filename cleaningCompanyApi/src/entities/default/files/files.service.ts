import { Injectable } from '@nestjs/common';
import { FileEntity } from './entity/file.entity';
import { Response } from 'express';
import sharp from 'sharp';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ExtendedException,
  ExtendedExceptionEnum,
} from '../../../auth/ExtendedException';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  async imageDisplay(
    req: Request,
    res: Response,
    id: number,
    quality: number = 100,
  ) {
    if (id == 0) {
      return await this.displayImageFromFile(res, undefined, quality);
    }
    const image = await this.filesRepository.findOne({
      where: {
        id: id,
      },
    });
    return await this.displayImageFromFile(res, image, quality);
  }

  public async displayImageFromFile(
    res: Response,
    file: FileEntity,
    quality: number,
  ) {
    if (file == undefined) {
      return res.sendFile('brak.png', { root: 'src/assets' });
    }
    res.set(
      'Content-Disposition',
      `inline; name="${file.name}" ; filename=${file.name}`,
    );
    res.set('Content-Type', file.typ);
    const path = 'assets/files/' + file.path;
    if (isNaN(quality) || quality == 100) {
      return res.sendFile(file.fakeName, { root: 'assets/files' });
    }
    console.log(1);
    //   console.time('compress');
    const compressedImage = await sharp(path + '/' + file.fakeName)
      .jpeg({ quality: Number(quality) }) // Określ jakość JPEG (80 - dobre jakościowo skompresowane zdjęcie)
      .toBuffer();
    //  console.timeEnd('compress');
    return res.send(compressedImage);
  }

  public async sendToServer(
    file: Express.Multer.File,
    req: Request,
  ): Promise<FileEntity> {
    const obj = new FileEntity();
    obj.name = file.originalname;
    obj.fakeName = file.filename;
    if (!file.filename || file.filename.length < 3) {
      throw new ExtendedException(ExtendedExceptionEnum.saveFailFaild);
    }
    obj.typ = file.mimetype;
    var fs = require('fs');
    var oldPath = 'assets/files/' + file.filename;
    var stats = fs.statSync(oldPath);
    obj.size = stats.size;
    await this.filesRepository.save(obj);

    return obj;
  }

  async getAllFiles(req: Request) {
    return await this.filesRepository.find({
      select: {
        name: true,
        size: true,
        typ: true,
        id: true,
        createTime: true,
      },
    });
  }
}
