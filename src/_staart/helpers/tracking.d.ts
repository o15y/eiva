import { Request, Response } from "@staart/server";
import { Locals, Event } from "../interfaces/general";
export declare const getTrackingData: () => any[];
export declare const getSecurityEvents: () => any[];
export declare const clearTrackingData: () => void;
export declare const clearSecurityEventsData: () => void;
export declare const trackEvent: (event: Event, locals?: Locals | undefined) => void;
export declare const trackUrl: (req: Request, res: Response) => Promise<void>;
