import axios from 'axios';
import { Moment } from 'moment';

import { OMNIBEES_ENDPOINT, Q_VALUE } from '../../config/config';

export class LeCantonFetchService {
    private checkIn: Moment | undefined = undefined;

    private checkOut: Moment | undefined = undefined;

    setCheckIn(checkIn: Moment) {
        this.checkIn = checkIn;
    }

    setCheckOut(checkOut: Moment) {
        this.checkOut = checkOut;
    }

    getAjaxEndpoint(): string {
        return OMNIBEES_ENDPOINT + '/Handlers/ajaxLoader.ashx';
    }

    getIndexEndpoint(): string {
        return OMNIBEES_ENDPOINT + '/default.aspx';
    }

    async getLeCantonQuotationHTML(): Promise<string> {
        const { sessionId, cookieSession } = await this.getCookieAndSessionId();

        const quotationResponse = await axios(this.getAjaxEndpoint(), {
            method: "GET",
            params: {
                'ucUrl': 'SearchResultsByRoom',
                'NRooms': '1',
                'ad': '1',
                'ch': '0',
                'CheckIn': this.checkIn ? this.checkIn.format('DDMMYYYY') : '',
                'CheckOut': this.checkOut ? this.checkOut.format('DDMMYYYY') : '',
                'q': Q_VALUE,
                'sid': sessionId,
            },
            headers: {
                "cookie": "ASP.NET_SessionId=" + cookieSession
            },
        });

        return quotationResponse.data;
    }

    private async getCookieAndSessionId(): Promise<{ cookieSession: string, sessionId: string }> {
        const indexResponse = await axios(this.getIndexEndpoint(), {
            method: 'GET',
            params: {
                q: Q_VALUE
            }
        });

        const html = indexResponse.data;
        const cookies = indexResponse.headers['set-cookie'];

        const sessionId = this.extractSessionId(html);
        const cookieSession = this.extractCookieSession(cookies);

        return {
            sessionId: sessionId,
            cookieSession: cookieSession
        }
    }

    private extractSessionId(html: string): string {
        const sessionInputMatch = /id="hfSID"\s+value="([a-z0-9\-]+)"/.exec(html);

        return sessionInputMatch ? sessionInputMatch[1] : '';
    }

    private extractCookieSession(cookies: string[]): string {
        const sessionIdCookie = cookies.filter((cookie: string) => cookie.indexOf('SessionId') >= 0)[0];
        const sessionIdCookieMatch = /ASP\.NET_SessionId=([a-z0-9]+)/.exec(sessionIdCookie);

        return sessionIdCookieMatch ? sessionIdCookieMatch[1] : '';
    }
}