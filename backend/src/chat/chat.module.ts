import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Chat } from './chat.model';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [TypegooseModule.forFeature([Chat]), SessionModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
