import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsNotEmpty()
  @IsEnum({ user: 'user', manager: 'manager' })
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsUUID()
  business_uuid: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateUserProfileDTO extends UpdateUserDTO {
  @Equals(undefined)
  mobile: string;
}
