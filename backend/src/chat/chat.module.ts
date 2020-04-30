import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Chat } from './chat.model';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypegooseModule.forFeature([Chat])],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
