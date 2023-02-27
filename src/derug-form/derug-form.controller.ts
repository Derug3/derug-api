import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DerugFormService } from './derug-form.service';
import { DerugRequestDto } from './dto/derug-requests.dto';
import { DerugDto } from './dto/derug.dto';

@Controller('derug-form')
export class DerugFormController {
  constructor(private readonly derugFormService: DerugFormService) {}

  @Get('/:collection')
  getAllRequests(@Param('collection') collection: string) {
    return this.derugFormService.getAllDerugRequests(collection);
  }

  @Post('/save')
  saveNewRequest(@Body() derugRequest: DerugDto) {
    return this.derugFormService.saveNewDerugRequest(derugRequest);
  }
}
