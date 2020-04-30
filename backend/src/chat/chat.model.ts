import { prop, arrayProp } from '@typegoose/typegoose';

export class Message {
  @prop({ required: true })
  sender: string;

  @prop({ required: true })
  message: string;
}

export class Chat {
  @prop({ required: true })
  roomName: string;

  @arrayProp({ items: String, default: [] })
  members: string[];

  @arrayProp({ items: Message, default: [] })
  messages: Message[];
}
