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
  handleAddRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ) {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      this.service.createChat(roomName);
      client.join(roomName);
      this.server.to(client.id).emit('joinedRoom', roomName);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ): void {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      client.leave(room);
    }
    client.join(roomName);
    this.server.to(room).emit('joinedRoom', { username, roomName })
  }

  @SubscribeMessage('toRoom')
  handleMessageToRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      this.service.addMessage(room, { sender: client.id,  message });
      this.server.to(room).emit('toClient', message);
    }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() username) {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      client.leave(room);
    }
  }

  @SubscribeMessage('exitRoom')
  handleExitRoom(@ConnectedSocket() client: Socket) {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      this.service.removeMember(room, client.id);
      client.leave(room);
    }
  }

  private getClientCurrentRoom(client: Socket) {
    return Object.keys(client.rooms).filter(room => room !== client.id)[0];
  }
}
