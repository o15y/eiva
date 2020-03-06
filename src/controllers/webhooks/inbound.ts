import { Controller, Get, Request } from "@staart/server";
import { joiValidate, Joi } from "@staart/validate";
import { respond, RESOURCE_SUCCESS } from "@staart/messages";

@Controller("inbound")
export class WebhooksInboundController {
  @Get("email/:id")
  async inboundEmail(req: Request) {
    const id = req.params.id;
    const secret = (req.get("Authorization") || "").replace("Bearer ", "");
    joiValidate(
      {
        id: Joi.string().required(),
        secret: Joi.string().required()
      },
      { id, secret }
    );
    console.log("Incoming email", id);
    return respond(RESOURCE_SUCCESS);
  }
}
