import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  sur_name: string;

  @IsNotEmpty()
  @IsNotEmpty()
  birthday: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  mobile: string;

  @IsNotEmpty()
  @IsUUID()
  business_uuid: string;
}
