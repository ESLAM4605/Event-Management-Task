import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, default: "Assuming it's there" })
  createdBy: string;

  @Prop({ type: [String], default: [] })
  rsvps: string[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
