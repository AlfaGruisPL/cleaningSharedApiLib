import { IsOptional, IsString } from 'class-validator';

export class ProjectDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  imageId: number;
}
