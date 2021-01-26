import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    TypegooseModule.forRoot(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }),
    ChatModule,
    AuthModule,
    UserModule,
    SessionModule,
  ],
})
export class AppModule {}
