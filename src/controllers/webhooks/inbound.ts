import { Controller, Get, Request } from "@staart/server";
import { joiValidate, Joi } from "@staart/validate";
import { respond, RESOURCE_SUCCESS } from "@staart/messages";
import { processIncomingEmail } from "../../rest/ara";

@Controller("inbound")
export class WebhooksInboundController {
  @Get("email/:objectId")
  async inboundEmail(req: Request) {
    const objectId = req.params.objectId;
    const secret = (req.get("Authorization") || req.query.secret || "").replace(
      "Bearer ",
      ""
    );
    joiValidate(
      {
        objectId: Joi.string().required(),
        secret: Joi.string().required()
      },
      { objectId, secret }
    );
    await processIncomingEmail(secret, objectId);
    return respond(RESOURCE_SUCCESS);
  }
}
