import { SetMetadata } from '@nestjs/common';
import { Role } from '../misc/role.enum';

export const ROLES_KEY = 'user_roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
