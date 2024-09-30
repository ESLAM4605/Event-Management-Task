import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  // Create Event
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { date } = createEventDto;

    // Check if the date is not in the past
    if (new Date(date) < new Date()) {
      throw new BadRequestException('Event date cannot be in the past.');
    }

    // Limit event creation to 5 per day
    const createdBy = "Assuming it's there";
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const eventsToday = await this.eventModel.countDocuments({
      createdBy: createdBy,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (eventsToday >= 5) {
      throw new BadRequestException(
        'User has exceeded the event creation limit for today.',
      );
    }
    const event = new this.eventModel({
      ...createEventDto,
      createdBy,
      date: new Date(createEventDto.date),
    });
    return event.save();
  }

  // Update Event
  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const { date } = updateEventDto;

    if (date && new Date(date) < new Date()) {
      throw new BadRequestException('Event date cannot be in the past.');
    }

    const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, {
      new: true,
    });
    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    return event;
  }

  // Delete Event
  async delete(id: string): Promise<void> {
    const event = await this.eventModel.findByIdAndDelete(id);
    if (!event) {
      throw new NotFoundException('Event not found.');
    }
  }

  // Find all or specific Event
  async find(id?: string): Promise<Event | Event[]> {
    if (id) {
      const event = await this.eventModel.findById(id);
      if (!event) {
        throw new NotFoundException('Event not found.');
      }
      return event;
    }
    return this.eventModel.find().exec();
  }

  // RSVP to Event
  async rsvp(id: string, username: string): Promise<Event> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    // Check if event has already occurred
    if (new Date(event.date) < new Date()) {
      throw new BadRequestException('Cannot RSVP to past events.');
    }

    // Check if user has already RSVPed
    if (event.rsvps.includes(username)) {
      throw new BadRequestException('User has already RSVPed to this event.');
    }

    event.rsvps.push(username);
    return event.save();
  }
}
