import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
