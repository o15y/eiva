import axios from "axios";
import { Entity } from "../../interfaces/google-cloud";

export const detectEntities = async (text: string) => {
  try {
    return (
      await axios.post<{
        language: string;
        entities: Entity[];
      }>(
        `https://language.googleapis.com/v1/documents:analyzeEntities?key=${process.env.NATURAL_LANGUAGE_API_KEY}`,
        {
          document: {
            content: text,
            type: "PLAIN_TEXT"
          },
          encodingType: "UTF8"
        },
        {}
      )
    ).data;
  } catch (error) {
    throw new Error("Unable to detect entities in text");
  }
};
