import { Controller, Get, Middleware, Request, Response } from "@staart/server";
import { processIncomingEmail } from "../../ara/rest";
import { Joi, joiValidate } from "@staart/validate";

export class InboundWebhooksController {
  @Get("email/:objectId")
  async lambdaWebhook(req: Request, res: Response) {
    const secret = (req.get("Authorization") || "").replace("Bearer ", "");
    joiValidate(
      { secret: Joi.string().required(), objectId: Joi.string().required() },
      { secret, objectId: req.params.objectId }
    );
    return processIncomingEmail(secret, req.params.objectId);
  }
}
