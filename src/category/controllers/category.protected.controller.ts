import { Controller, UseGuards } from '@nestjs/common';
import { CheckPermissionsGuard } from 'src/access_control/guards/check_permissions.guard';

@Controller(':business_uuid/category')
@UseGuards(CheckPermissionsGuard)
export class CategoryProtectedController {}
