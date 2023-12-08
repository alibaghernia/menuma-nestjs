import { Controller, UseGuards } from '@nestjs/common';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';
import { SessionGuard } from 'src/auth/guards';

@Controller(':business_uuid/category')
@UseGuards(CheckPermissionsGuard)
@UseGuards(SessionGuard)
export class CategoryProtectedController {}
