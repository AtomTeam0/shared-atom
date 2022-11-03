import { Server } from "socket.io";
import * as http from "http";
import { Global } from "../../../enums/helpers/Global";

const contextService = require("request-context");

let socketServer: Server;

export const setSocketServer = (server: http.Server) => {
  socketServer = new Server(server, {
    cors: { origin: "*", methods: ["GET", "PUT", "POST"] },
  });
  socketServer.engine.generateId = () => contextService.get(Global.USERID);
};

export const emitEvent = (
  eventName: string,
  data?: any,
  roomName?: string
): void => {
  if (roomName) {
    socketServer.to(roomName).emit(eventName, data);
  } else {
    socketServer.emit(eventName, data);
  }
};

export const updateSocketRoom = async (roomOptions: {
  joinRoomId: string;
  leaveRoomId: string;
}): Promise<void> => {
  const socket = socketServer.sockets.sockets.get(
    contextService.get(Global.USERID)
  );
  if (socket) {
    socket?.leave(roomOptions.leaveRoomId);
    socket?.join(roomOptions.joinRoomId);
  }
};
