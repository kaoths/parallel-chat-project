import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get(':room')
  getRoomInformation(@Param('room') room: string) {
    return this.service.getRoomInformation(room)
  }

  @Get(':room/messages')
  getRoomMessages(@Param('room') room: string) {
    return this.service.getRoomMessages(room)
  }
}

