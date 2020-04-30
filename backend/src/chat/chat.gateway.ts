import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly service: ChatService) {}

  @SubscribeMessage('addRoom')
  async handleAddRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { username, roomName },
  ): Promise<void> {
    const room = this.getClientCurrentRoom(client);
    if (room) client.leave(room);
    const roomInfo = await this.service.createChat(roomName);
    await this.service.addMember(roomName, username);
    client.join(roomName);
    this.server.to(client.id).emit('joinedRoom', { username, roomInfo });
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { username, roomName },
  ): Promise<void> {
    const room = this.getClientCurrentRoom(client);
    if (room) client.leave(room);
    const roomInfo = await this.service.getRoomInformation(roomName);
    if (!roomInfo.members.includes(username)) await this.service.addMember(roomName, username)
    client.join(roomName);
    this.server.to(room).emit('joinedRoom', { username, roomInfo })
  }

  @SubscribeMessage('toRoom')
  async chandleMessageToRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { username, message },
  ) {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      const timestamp = new Date();
      await this.service.addMessage(room, { sender: username, message, timestamp });
      this.server.to(room).emit('toClient', { username, message, timestamp });
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() username
  ) {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      client.leave(room);
      this.server.to(room).emit('leftRoom', username)
    }
  }

  @SubscribeMessage('exitRoom')
  async handleExitRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() username
  ) {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      await this.service.removeMember(room, client.id);
      client.leave(room);
      this.server.to(room).emit('exitedRoom', username)
    }
  }

  private getClientCurrentRoom(client: Socket) {
    return Object.keys(client.rooms).filter(room => room !== client.id)[0];
  }
}
