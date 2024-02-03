import { Equals, IsArray, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsArray()
  businesses?: {
    business_uuid: string;
    role: string;
  }[];

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateUserProfileDTO extends UpdateUserDTO {
  @Equals(undefined)
  mobile: string;
}
