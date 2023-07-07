import * as jayson from "jayson/promise";
import { IChapter } from "common-atom/interfaces/chapter.interface";
import { ILesson } from "common-atom/interfaces/lesson.interface";
import { IPakal } from "common-atom/interfaces/pakal.interface";
import { config } from "../../../config";
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
      []
    );
  }

  static async getPakalById(pakalId: string): Promise<IPakal> {
    return RPCClientRequest(
      LessonRPCService.rpcClient,
      "getPakalById",
      {
        pakalId,
      },
      []
    );
  }

  static async getChapterById(chapterId: string): Promise<IChapter> {
    return RPCClientRequest(LessonRPCService.rpcClient, "getChapterById", {
      chapterId,
    });
  }
}
