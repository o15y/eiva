import { parse } from "chrono-node";

export const getDateInfoFromString = (text: string) => parse(text)[0];

export const findDateTimeinText = (text: string) => parse(text);
