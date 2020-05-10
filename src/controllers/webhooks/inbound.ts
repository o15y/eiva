import { Controller, Get, Middleware, Request, Response } from "@staart/server";
import { processIncomingEmail } from "../../ara/rest";
import { Joi, joiValidate } from "@staart/validate";

export class InboundWebhooksController {
  @Get("email/:objectId")
  async lambdaWebhook(req: Request, res: Response) {
    const secret =
      (req.get("Authorization") || "").replace("Bearer ", "") ||
      req.query.secret;
    joiValidate(
      { secret: Joi.string().required(), objectId: Joi.string().required() },
      { secret, objectId: req.params.objectId }
    );
    processIncomingEmail(secret, req.params.objectId).catch((err) =>
      console.log(err)
    );
    return { queued: true };
  }
}
