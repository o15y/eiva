import { Server } from "@staart/server";
export declare class Staart extends Server {
    constructor();
    start(port: number): void;
    private setupHandlers;
}
