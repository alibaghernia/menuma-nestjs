import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

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

  @IsNotEmpty()
  @IsEnum({ user: 'user', manager: 'manager' })
  @IsString()
  role: string;

  @ValidateIf((e) => !e.mobile && !e.username)
  @IsString()
  email: string;

  @IsOptional()
  @IsUUID()
  business_uuid: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
