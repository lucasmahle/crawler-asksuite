import { Moment } from "moment";

const CACHE: { [key: string]: string } = {};

export const LeCantonCacheService = {
    generateKey(checkIn: Moment | undefined, checkOut: Moment | undefined) {
        const keyCheckIn = checkIn?.format('YYYYMMDD') ?? '';
        const keyCheckOut = checkOut?.format('YYYYMMDD') ?? '';

        return `${keyCheckIn}-${keyCheckOut}`;
    },

    getHtml(key: string): string | null {
        if (key in CACHE) {
            return CACHE[key];
        }

        return null;
    },

    setHtml(key: string, html: string) : void {
        CACHE[key] = html;
    }
}