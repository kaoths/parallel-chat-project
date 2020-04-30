import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forRoot(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }),
    ChatModule,
  ],
})
export class AppModule {}
