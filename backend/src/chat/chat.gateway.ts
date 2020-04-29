import {
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
  handleMessage(client: any, payload: any): void {
    this.server.emit('toClient', payload);
  }

  afterInit(server: Server) {
    console.log('init')
  }

  handleDisconnect(client: Socket): any {
    console.log(`${client.id} disconnected`)
  }

  handleConnection(client: Socket, ...args): any {
    console.log(`${client.id} connected`)
  }
}
