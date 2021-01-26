import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { SessionService } from '../session/session.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private readonly service: ChatService,
    private readonly sessionService: SessionService,
  ) {}

  async handleConnection(
    @ConnectedSocket() client: Socket,
    //@MessageBody() { username },
  ) {
    //const rooms = await this.service.findByUsername(username);
    this.server.to(client.id).emit('connected');
  }

  @SubscribeMessage('addRoom')
  async handleAddRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { username, roomName },
  ): Promise<void> {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      await this.sessionService.update({ username, roomName: room });
      client.leave(room);
      this.server.to(room).emit('leftRoom', username);
    }
    const roomInfo = await this.service.createChat(roomName);
    await this.service.addMember(roomName, username);
    const { lastActiveAt } = await this.sessionService.findOne({
      username,
      roomName,
    });
    client.join(roomName);
    this.server
      .to(roomName)
      .emit('joinedRoom', { username, roomInfo, lastActiveAt });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { username, roomName },
  ): Promise<void> {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      await this.sessionService.update({ username, roomName: room });
      client.leave(room);
      this.server.to(room).emit('leftRoom', username);
    }
    const roomInfo = await this.service.getRoomInformation(roomName);
    await this.service.addMember(roomName, username);
    const { lastActiveAt } = await this.sessionService.findOne({
      username,
      roomName,
    });
    client.join(roomName);
    this.server
      .to(roomName)
      .emit('joinedRoom', { username, roomInfo, lastActiveAt });
  }

  @SubscribeMessage('toRoom')
  async handleMessageToRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { username, message },
  ) {
    const roomName = this.getClientCurrentRoom(client);
    if (roomName) {
      const timestamp = new Date();
      await this.service.addMessage(roomName, {
        sender: username,
        message,
        timestamp,
      });
      await this.sessionService.update({ username, roomName });
      this.server
        .to(roomName)
        .emit('toClient', { username, message, timestamp });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() username,
  ) {
    const roomName = this.getClientCurrentRoom(client);
    if (roomName) {
      await this.sessionService.update({ username, roomName });
      client.leave(roomName);
      this.server.to(roomName).emit('leftRoom', username);
    }
  }

  @SubscribeMessage('exitRoom')
  async handleExitRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() username,
  ) {
    const roomName = this.getClientCurrentRoom(client);
    if (roomName) {
      await this.service.removeMember(roomName, client.id);
      await this.sessionService.delete({ roomName, username });
      client.leave(roomName);
      this.server.to(roomName).emit('exitedRoom', username);
    }
  }

  private getClientCurrentRoom(client: Socket) {
    return Object.keys(client.rooms).filter(room => room !== client.id)[0];
  }
}
