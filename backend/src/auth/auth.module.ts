import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'parallel-chat',
    }),
    UserModule,
    ChatModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
