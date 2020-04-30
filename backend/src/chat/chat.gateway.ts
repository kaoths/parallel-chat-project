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
    client.join(roomName);
    this.server.to(client.id).emit('joinedRoom', roomName);
  }

  @SubscribeMessage('toRoom')
  handleMessageToRoom(@ConnectedSocket() client: Socket, @MessageBody() message: string) {
    const room = Object.keys(client.rooms).filter(room => room !== client.id);
    this.server.to(room[0]).emit('toClient', message);
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
}
