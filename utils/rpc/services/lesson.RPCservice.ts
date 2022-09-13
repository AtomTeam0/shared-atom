import * as jayson from "jayson/promise";
import { IChapter } from "../../../interfaces/chapter.interface";
import { ILesson } from "../../../interfaces/lesson.interface";
import { IPakal } from "../../../interfaces/pakal.interface";
import { RPCconfig } from "../rpc.config";
import { RPCClientRequest } from "../rpc.functions";

export class LessonRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: RPCconfig.lessonService.rpcHostname,
    port: RPCconfig.lessonService.rpcPort,
  });

  static async getLessonById(lessonId: string): Promise<ILesson> {
    return RPCClientRequest(LessonRPCService.rpcClient, "getLessonById", {
      lessonId,
    });
  }

  static async getPakalById(pakalId: string): Promise<IPakal> {
    return RPCClientRequest(LessonRPCService.rpcClient, "getPakalById", {
      pakalId,
    });
  }

  static async getChapterById(chapterId: string): Promise<IChapter> {
    return RPCClientRequest(LessonRPCService.rpcClient, "getChapterById", {
      chapterId,
    });
  }
}
