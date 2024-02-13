import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum discountTypes {
  CONDITIONAL = 'CONDITIONAL',
  NORMAL = 'NORMAL',
  ALL = 'ALL',
}

export class CreateDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  discount: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(discountTypes)
  type: string;

  @IsOptional()
  @IsUUID()
  business_uuid: string;
}

export class CreateAdminDTO extends CreateDTO {
  @IsNotEmpty()
  business_uuid: string;
}
