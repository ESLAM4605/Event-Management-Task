import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Create Event
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  // Update Event
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  // Delete Event
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }

  // Get Events
  @Get(':id?')
  find(@Param('id') id?: string) {
    return this.eventsService.find(id);
  }

  // RSVP to Event
  @Post(':id/rsvp')
  rsvp(@Param('id') id: string, @Body('username') username: string) {
    return this.eventsService.rsvp(id, username);
  }
}
