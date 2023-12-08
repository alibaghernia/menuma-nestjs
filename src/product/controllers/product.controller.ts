import { Controller } from '@nestjs/common';
import { ProductPanelService } from '../services/product.panel.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductPanelService) {}
}
