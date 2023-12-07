import { SetMetadata } from '@nestjs/common';

export const CHECK_PERMISSIONS = 'check_permissions';

export const CheckPermissions = (
  permissions: string[],
  from_body?: boolean,
  id_field: string = 'business_uuid',
) => SetMetadata(CHECK_PERMISSIONS, { permissions, from_body, id_field });
