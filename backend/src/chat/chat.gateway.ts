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
    this.server.emit('toClient', payload); //echo checker
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string): void {
    const room = this.getClientCurrentRoom(client);
    if (room) {
      return //client is already in another room --> leave first
    }
    client.join(roomName);
    this.server.to(client.id).emit('joinedRoom', roomName);
  }

  @SubscribeMessage('toRoom')
  handleMessageToRoom(@ConnectedSocket() client: Socket, @MessageBody() message: string) {
    const room = this.getClientCurrentRoom(client);
    if (room) this.server.to(room).emit('toClient', message);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@ConnectedSocket() client: Socket) {
    const room = this.getClientCurrentRoom(client);
    if (room) client.leave(room);
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
