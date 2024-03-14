import { IsOptional, IsString } from 'class-validator';

export class AspectDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
  @IsString()
  shortDescription: string;
  @IsOptional()
  imageId: number;
}
