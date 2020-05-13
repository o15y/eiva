import {
  Controller,
  Get,
  Post,
  Middleware,
  Request,
  Response,
  ClassMiddleware,
} from "@staart/server";
import { joiValidate, Joi } from "@staart/validate";
import { AddressObject } from "mailparser";
import { authHandler, validator } from "../../_staart/helpers/middleware";
import { classifyTokens } from "../../ara/services/classify";
import { smartTokensFromText } from "../../ara/services/tokenize";
import { parseEmail } from "../../ara/services/parse";
import { trackOutgoingEmail } from "../../ara/rest";
import { performAction } from "../../ara/services/actions";
import { ApiKeyResponse } from "../../_staart/helpers/jwt";

@ClassMiddleware(authHandler)
export class ApiController {
  @Post("classify")
  async classify(req: Request) {
    const text: string[] = req.body.text;
    joiValidate({ text: Joi.array().required() }, { text });
    return classifyTokens(text, () => {});
  }

  @Post("parse-email")
  async parseEmail(req: Request) {
    const text: string = req.body.text;
    joiValidate({ text: Joi.array().required() }, { text });
    return parseEmail(text);
  }

  @Post("smart-tokenize")
  async smartTokenize(req: Request) {
    const text: string = req.body.text;
    const from: AddressObject = req.body.from;
    joiValidate(
      { text: Joi.string().required(), from: Joi.object() },
      { text, from }
    );
    return smartTokensFromText(text, from);
  }

  @Post("perform-action")
  async performAction(req: Request, res: Response) {
    const token: ApiKeyResponse = res.locals.token;
    const text: string = req.body.text;
    const organizationId = token.organizationId;
    joiValidate(
      {
        text: Joi.string().required(),
        organizationId: Joi.string().required(),
      },
      { text, organizationId }
    );
    return {};
    // return performAction(organizationId, req.body, text, () => {});
  }

  @Get("read-receipt")
  @Middleware(validator({ token: Joi.string() }, "query"))
  async readReceiptEmail(req: Request, res: Response) {
    const token = req.query.token as string;
    trackOutgoingEmail(token)
      .then(() => {})
      .catch(() => {});
    res.writeHead(200, { "Content-Type": "image/gif" });
    res.end(
      Buffer.from("R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=", "base64"),
      "binary"
    );
  }
}
