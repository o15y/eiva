import { ClassMiddleware, Controller, Get, Request } from "@staart/server";
import { authHandler } from "../../helpers/middleware";
import { smartTokensFromText } from "../../helpers/services/ara/tokenize";
import { joiValidate, Joi } from "@staart/validate";
import { classifyTokens } from "../../helpers/services/ara/classify";
import { AddressObject } from "mailparser";
import { parseEmail } from "../../helpers/services/ara/parse";

@Controller("api")
@ClassMiddleware(authHandler)
export class AdminController {
  @Get("classify")
  async classify(req: Request) {
    const text: string[] = req.body.text;
    joiValidate({ text: Joi.array().required() }, { text });
    return classifyTokens(text, () => {});
  }

  @Get("parse-email")
  async parseEmail(req: Request) {
    const text: string = req.body.text;
    joiValidate({ text: Joi.array().required() }, { text });
    return parseEmail(text);
  }

  @Get("smart-tokenize")
  async smartTokenize(req: Request) {
    const text: string = req.body.text;
    const from: AddressObject = req.body.from;
    joiValidate(
      { text: Joi.string().required(), from: Joi.object() },
      { text, from }
    );
    return smartTokensFromText(text, from);
  }
}
