import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'is_public';
export const IS_ADMIN_KEY = 'is_admin';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
