declare module chrono {
  export interface ParsedResult {
    start: ParsedComponents;
    end: ParsedComponents;
    index: number;
    text: string;
    ref: Date;
  }

  export interface Values {
    day?: string;
    month?: string;
    weekday?: string;
    year?: string;
    hour?: string;
    minute?: string;
    second?: string;
    millisecond?: string;
  }

  export interface ParsedComponents {
    knownValues: Values;
    impliedValues: Values;
    assign(component: string, value: number): void;
    imply(component: string, value: number): void;
    get(component: string): number;
    isCertain(component: string): boolean;
    date(): Date;
  }

  export function parseDate(text: string, refDate?: Date, opts?: any): Date;
  export function parse(
    text: string,
    refDate?: Date,
    opts?: any
  ): ParsedResult[];
}

declare module "chrono-node" {
  export = chrono;
}
