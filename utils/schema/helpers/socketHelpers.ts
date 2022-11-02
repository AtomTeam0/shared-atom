import { Server } from "socket.io";
import * as http from "http";
import { Global } from "../../../enums/helpers/Global";

const contextService = require("request-context");

export const setSocketServer = (server: http.Server) => {
  const socketServer = new Server(server, {
    cors: { origin: "*", methods: ["GET", "PUT", "POST"] },
  });
  socketServer.engine.generateId = () => contextService.get(Global.USERID);

  contextService.set(Global.SOCKET_SERVER, socketServer);
};

export const emitEvent = (
  eventName: string,
  data?: any,
  roomName?: string
): void => {
  if (roomName) {
    contextService.get(Global.SOCKET_SERVER).to(roomName).emit(eventName, data);
  } else {
    contextService.get(Global.SOCKET_SERVER).emit(eventName, data);
  }
};

export const updateSocketRoom = async (roomOptions: {
  joinRoomId: string;
  leaveRoomId: string;
}): Promise<void> => {
  const socket = contextService
    .get(Global.SOCKET_SERVER)
    .sockets.sockets.get(contextService.get(Global.USERID));
  if (socket) {
    socket?.leave(roomOptions.leaveRoomId);
    socket?.join(roomOptions.joinRoomId);
  }
};
