import { Server } from "socket.io";
import * as http from "http";

export class SocketServer {
  private static socketIOServer: Server | undefined = undefined;

  constructor(server: http.Server) {
    // eslint-disable-next-line no-constructor-return
    if (SocketServer.socketIOServer) return SocketServer.socketIOServer;
    SocketServer.socketIOServer = new Server(server, {
      cors: { origin: "*", methods: ["GET", "PUT", "POST"] },
    });

    SocketServer.socketIOServer.engine.generateId = () => (<any>global).userId;
  }

  public static emitEvent(
    eventName: string,
    data?: any,
    roomName?: string
  ): void {
    if (roomName) {
      SocketServer.socketIOServer?.to(roomName).emit(eventName, data);
    } else {
      SocketServer.socketIOServer?.emit(eventName, data);
    }
  }

  public static updateSocketRoom(roomOptions: {
    joinRoomId: string;
    leaveRoomId: string;
  }): void {
    const socket = SocketServer.socketIOServer?.sockets.sockets.get(
      (<any>global).userId
    );
    if (socket) {
      socket?.leave(roomOptions.leaveRoomId);
      socket?.join(roomOptions.joinRoomId);
    }
  }
}
