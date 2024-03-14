import { IsString } from 'class-validator';

export class AddUserDto {
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsString()
  email: string;
}
