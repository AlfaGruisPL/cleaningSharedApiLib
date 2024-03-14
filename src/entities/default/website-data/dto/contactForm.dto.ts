import { IsNotEmpty } from 'class-validator';

export class ContactFormDto {
  @IsNotEmpty()
  name: string;
  /* @IsNotEmpty()
   surname: string;*/
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  numberOfPhone: string;
  @IsNotEmpty()
  content;
}
