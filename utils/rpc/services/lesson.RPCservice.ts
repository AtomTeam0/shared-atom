import * as jayson from "jayson/promise";
import { config } from "../../../config";
import { IChapter } from "../../../common/interfaces/chapter.interface";
import { ILesson } from "../../../common/interfaces/lesson.interface";
import { IPakal } from "../../../common/interfaces/pakal.interface";
import { RPCClientRequest } from "../rpc.functions";

export class LessonRPCService {
  private static rpcClient = jayson.Client.http({
    hostname: config.rpc.lessonService.rpcHostname,
    port: config.rpc.lessonService.rpcPort,
  });

  static async getLessonById(lessonId: string): Promise<ILesson> {
    return RPCClientRequest(
      LessonRPCService.rpcClient,
      "getLessonById",
      {
        lessonId,
      },
      false
    );
  }

  static async getPakalById(pakalId: string): Promise<IPakal> {
    return RPCClientRequest(
      LessonRPCService.rpcClient,
      "getPakalById",
      {
        pakalId,
      },
      false
    );
  }

  static async getChapterById(chapterId: string): Promise<IChapter> {
    return RPCClientRequest(LessonRPCService.rpcClient, "getChapterById", {
      chapterId,
    });
  }
}
