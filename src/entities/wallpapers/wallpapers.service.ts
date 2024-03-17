import { Injectable } from '@nestjs/common';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallpaper } from './entities/wallpaper.entity';

@Injectable()
export class WallpapersService {
  constructor(
    @InjectRepository(Wallpaper)
    private wallpaperRep_: Repository<Wallpaper>,
  ) {}

  create(createWallpaperDto: CreateWallpaperDto) {
    return 'This action adds a new wallpaper';
  }

  async findAll() {
    return await this.wallpaperRep_.find();
  }

  async findOne(id: number) {
    return await this.wallpaperRep_.find({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateWallpaperDto: UpdateWallpaperDto) {
    return `This action updates a #${id} wallpaper`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallpaper`;
  }
}
