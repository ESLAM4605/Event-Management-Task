import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event, EventSchema } from './schema/event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]), // Register Event schema
  ],
  controllers: [EventsController], // Define the EventController
  providers: [EventsService], // Define the EventService
})
export class EventsModule {}
