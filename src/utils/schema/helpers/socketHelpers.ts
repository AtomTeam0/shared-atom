import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { Global } from "common-atom/enums/helpers/Global";
import { AreaNames } from "common-atom/enums/AreaNames";
import { getContext } from "../../helpers/context";

let socketServer: SocketServer;

export const setSocketServer = (server: Server) => {
  socketServer = new SocketServer(server, {
    cors: { origin: "*", methods: ["GET", "PUT", "POST"] },
  });
  socketServer.engine.generateId = () => getContext(Global.USER)._id;
};

export const emitEvent = (
  eventName: string,
  data?: any,
  roomName?: string
): void => {
  const toEmit = roomName ? socketServer.to(roomName) : socketServer;
  if (data) {
    toEmit.emit(eventName, data);
  } else {
    toEmit.emit(eventName);
  }
};

export const updateSocketRoom = async (roomOptions: {
  joinRoomId: AreaNames;
  leaveRoomId?: AreaNames;
}): Promise<void> => {
  const socket = socketServer.sockets.sockets.get(getContext(Global.USER)._id);
  if (socket) {
    if (roomOptions.leaveRoomId) {
      socket?.leave(roomOptions.leaveRoomId);
    }
    socket?.join(roomOptions.joinRoomId);
  }
};
