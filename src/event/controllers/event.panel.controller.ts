import { Controller } from '@nestjs/common';
import { EventPanelService } from '../services/event.panel.service';

@Controller('/panel/events')
export class EventPanelController {
  constructor(private eventPanelService: EventPanelService) {}
}
