import {
  Controller,
  Post,
  Middleware,
  Request,
  Response,
  ClassMiddleware,
} from "@staart/server";
import { authHandler } from "../../_staart/helpers/middleware";

@ClassMiddleware(authHandler)
export class ApiController {
  @Post("classify")
  async classify(req: Request, res: Response) {
    return { hello: "world" };
  }

  @Post("parse-email")
  async parseEmail(req: Request, res: Response) {
    return { hello: "world" };
  }

  @Post("smart-tokenize")
  async smartTokenize(req: Request, res: Response) {
    return { hello: "world" };
  }

  @Post("perform-action")
  async performAction(req: Request, res: Response) {
    return { hello: "world" };
  }
}
