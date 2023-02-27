import { Controller } from '@nestjs/common';
import { DerugFormService } from './derug-form.service';

@Controller('derug-form')
export class DerugFormController {
  constructor(private readonly derugFormService: DerugFormService) {}
}
