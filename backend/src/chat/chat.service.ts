import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Chat, Message } from './chat.model';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat) private readonly model: ReturnModelType<typeof Chat>,
  ) {}

  findByRoomName(roomName: string) {
    return this.model.findOne({ roomName });
  }

  createChat(roomName: string) {
    const chat = new this.model({ roomName });
    return chat.save();
  }

  addMember(roomName: string, name: string) {
    return this.model.findOneAndUpdate(
      { roomName },
      {
        $push: { members: name },
      },
    );
  }

  addMessage(roomName: string, message: Message) {
    return this.model.findOneAndUpdate(
      { roomName },
      {
        $push: { messages: message },
      },
    );
  }

  removeMember(roomName: string, name: string) {
    return this.model.findByIdAndUpdate(
      { roomName },
      {
        $pull: { members: name },
      },
    );
  }
}
