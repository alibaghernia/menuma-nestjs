import { Controller, Get, Param } from '@nestjs/common';
import { BusinessPanelService } from '../services/business.panel.service';
import { NotEmptyPipe } from 'src/pipes/not_empty.pipe';

@Controller('business')
export class BusinessController {
  constructor(private businessService: BusinessPanelService) {}

  @Get(':slug')
  getBySlug(
    @Param('slug', new NotEmptyPipe('Business Slug Or UUID'))
    slugOrId: string,
  ) {
    return this.businessService.findBySlugOrId(slugOrId);
  }
}
