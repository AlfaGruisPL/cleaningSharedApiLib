import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WallpapersService } from './wallpapers.service';
import { CreateWallpaperDto } from './dto/create-wallpaper.dto';
import { UpdateWallpaperDto } from './dto/update-wallpaper.dto';

@Controller('wallpapers')
export class WallpapersController {
  constructor(private readonly wallpapersService: WallpapersService) {}

  @Post()
  create(@Body() createWallpaperDto: CreateWallpaperDto) {
    return this.wallpapersService.create(createWallpaperDto);
  }

  @Get()
  findAll() {
    return this.wallpapersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wallpapersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWallpaperDto: UpdateWallpaperDto) {
    return this.wallpapersService.update(+id, updateWallpaperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wallpapersService.remove(+id);
  }
}
