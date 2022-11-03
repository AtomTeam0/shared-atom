import { Server } from "socket.io";
import * as http from "http";
import { getContext } from "../../helpers/context";
import { Global } from "../../../enums/helpers/Global";

let socketServer: Server;

export const setSocketServer = (server: http.Server) => {
  socketServer = new Server(server, {
    cors: { origin: "*", methods: ["GET", "PUT", "POST"] },
  });
  socketServer.engine.generateId = () => getContext(Global.USERID);
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
  const socket = socketServer.sockets.sockets.get(getContext(Global.USERID));
  if (socket) {
    socket?.leave(roomOptions.leaveRoomId);
    socket?.join(roomOptions.joinRoomId);
  }
};
