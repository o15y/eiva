import { ActionParams } from "../interfaces";
import moment, { Moment } from "moment-timezone";
import { users } from "@prisma/client";
/**
 * Confirm if a meeting slot is empty/available
 * @param user - User details
 * @param startTime - Start time
 * @param endTime - End time
 */
export declare const confirmIfSlotAvailable: (user: users, startTime: Moment, endTime: Moment) => Promise<boolean>;
/**
 Get a list of recommended slots for an appointment
 @param params - Global action parameters
 @param startTime - Starting time (optional)
 @param endTime - Ending time (optional)
*/
export declare const recommendDates: (params: ActionParams, duration: number, startTime?: moment.Moment | undefined, endTime?: moment.Moment | undefined) => Promise<import("calendar-slots").Slot[]>;
export declare const findDateTimeinText: (text: string) => any;
export declare const convertDigitDates: (text: string) => string;
