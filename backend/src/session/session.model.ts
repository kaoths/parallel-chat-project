import { prop } from '@typegoose/typegoose';

export class Session {
  @prop({ required: true })
  username: string;

  @prop({ required: true })
  roomName: string;

  @prop({ required: true, default: Date.now() })
  lastActiveAt: Date;
}
