import { smartTokensFromText } from "../../services/ara/tokenize";
import { AddressObject } from "mailparser";

const mockEmail: [string, AddressObject] = [
  `
    Dear Ara,

    Can you set up my call with John for next week?

    Best,

    Anand Chowdhary
    Co-founder and CEO, Oswald Labs
    Email: example@example.com
    Phone: +1 (123) 456-7890
  `,
  {
    value: [
      {
        address: "example@example.com",
        name: "Anand Chowdhary"
      }
    ],
    html: `<a href="mailto:example@example.com">Anand Chowdhary</a>`,
    text: "Anand Chowdhary <example@example.com>"
  }
];

test("smartly tokenizes email", async () => {
  expect(await smartTokensFromText(mockEmail[0], mockEmail[1])).toEqual([
    "set up my call with john for next week"
  ]);
});
