import { config } from '../config';
import { IUser } from '../interfaces/user.interface';
import { RPCRequest } from '../utils/rpc';

export class UsersRPCService {
  static rpcHostname = config.endPoints.userService.rpcHostname;
  
  static rpcPort = config.endPoints.userService.rpcPort;

  static async getById(userId: string): Promise<IUser> {
    return RPCRequest(
      UsersRPCService.rpcHostname,
      UsersRPCService.rpcPort,
      'getById',
      {
        userId,
      },
    );
  }
  
  static async addLastWatched(userId: string, itemId: string): Promise<IUser> {
    return RPCRequest(
      UsersRPCService.rpcHostname,
      UsersRPCService.rpcPort,
      'addLastWatched',
      {
        userId,
        itemId
      },
    );
  }

  static async getAmountOfUsers(): Promise<number> {
    return RPCRequest(
      UsersRPCService.rpcHostname,
      UsersRPCService.rpcPort,
      'getAmountOfUsers',
    );
  }
}
