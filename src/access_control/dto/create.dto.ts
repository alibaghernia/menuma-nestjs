import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateBusinessRoleDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class AssignPermissionToBusinessRoleDTO {
  @ValidateIf((e) => !e.permissions_uuid)
  @IsUUID()
  @IsNotEmpty()
  permission_uuid?: string;

  @ValidateIf((e) => !e.permissions_uuid)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IsString)
  permissions_uuid?: string[];
}
