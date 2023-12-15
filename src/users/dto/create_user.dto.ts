import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  last_name: string;

  @ValidateIf((e) => !!!e.email && !!!e.mobile)
  @IsString()
  @IsNotEmpty()
  username: string;

  @ValidateIf((e) => !!!e.email && !!!e.username)
  @IsString()
  mobile: string;

  @ValidateIf((e) => !e.mobile && !e.username)
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
