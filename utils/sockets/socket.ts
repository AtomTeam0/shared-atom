import { Server } from "socket.io";
import * as http from "http";

export class Socket {
  private static socketIOServer: Server | undefined = undefined;

  constructor(server: http.Server) {
    // eslint-disable-next-line no-constructor-return
    if (Socket.socketIOServer) return Socket.socketIOServer;
    Socket.socketIOServer = new Server(server, {
      cors: { origin: "*", methods: ["GET", "PUT", "POST"] },
    });

    Socket.socketIOServer.on("connection", (socket) => {
      console.log(socket);
    });
  }

  public static emitEvent<T>(eventName: string, changedData?: T): void {
    Socket.socketIOServer?.emit(eventName, changedData);
  }

  public static joinRooms(socket: any, roomIds: string | string[]) {
    socket?.join(roomIds);
  }

  public static leaveRooms(socket: any, roomsId: string | string[]) {
    socket?.leave(roomsId);
  }
}
