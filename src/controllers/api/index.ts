import {
  ClassMiddleware,
  Controller,
  Request,
  Response,
  Post
} from "@staart/server";
import { authHandler } from "../../helpers/middleware";
import { smartTokensFromText } from "../../helpers/services/ara/tokenize";
import { joiValidate, Joi } from "@staart/validate";
import { classifyTokens } from "../../helpers/services/ara/classify";
import { AddressObject } from "mailparser";
import { parseEmail } from "../../helpers/services/ara/parse";
import { performAction } from "../../helpers/services/ara/actions";
import { ApiKeyResponse } from "../../helpers/jwt";

@Controller("api")
@ClassMiddleware(authHandler)
export class AdminController {
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
        organizationId: Joi.string().required()
      },
      { text, organizationId }
    );
    return performAction(organizationId, text, () => {});
  }
}
