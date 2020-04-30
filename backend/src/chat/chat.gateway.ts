import {
  ConnectedSocket, MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  @SubscribeMessage('toServer')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: any): void {
    this.server.to(client.id).emit('toClient', payload); //echo checker
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() { username, roomName}): void {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      client.leave(room);
    }
    client.join(roomName);
    this.server.to(room).emit('joinedRoom', { username, roomName })
  }

  @SubscribeMessage('toRoom')
  handleMessageToRoom(@ConnectedSocket() client: Socket, @MessageBody() { username, message }) {
    const room = this.getClientCurrentRoom(client);
    if (room) this.server.to(room).emit('toClient', { username, message });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() username) {
    const room = this.getClientCurrentRoom(client);
    if (room) client.leave(room);
    this.server.to(room).emit('leftRoom', username)
  }

  afterInit(server: Server) {
    console.log('init', server);
  }

  handleDisconnect(client: Socket): any {
    console.log(`${client.id} disconnected`);
  }

  handleConnection(client: Socket, ...args): any {
    console.log(`${client.id} connected`, args);
  }

  getClientCurrentRoom(client: Socket){
    return Object.keys(client.rooms).filter(room => room !== client.id)[0];
  }
}
