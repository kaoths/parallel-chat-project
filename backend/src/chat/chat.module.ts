import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Chat } from './chat.model';

@Module({
  imports: [TypegooseModule.forFeature([Chat])],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
