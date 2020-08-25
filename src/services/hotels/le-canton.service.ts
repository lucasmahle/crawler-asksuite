import axios from 'axios';
import fs from 'fs';
import { Moment } from 'moment';

export class LeCantonService {
    //https://myreservations.omnibees.com/default.aspx?q=5462#/&diff=false&CheckIn=23092020&CheckOut=24092020&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-    
    private readonly qValue = '5462';

    private html: string = '';
    private checkIn: Moment | undefined = undefined;
    private checkOut: Moment | undefined = undefined;

    setCheckIn(checkIn: Moment) {
        this.checkIn = checkIn;
    }

    setCheckOut(checkOut: Moment) {
        this.checkOut = checkOut;
    }

    async fetchDataLeCanton(): Promise<any> {
        try {
            this.html = await this.getLeCantonQuotationHTML();

            return await this.getQuotationFromHtml();
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    async getQuotationFromHtml() {
        this.html;

        // const trNodes = document.querySelectorAll('.maintable > tbody > tr');
        // const trList = Array.prototype.slice.call(trNodes);

        // const rooms = [];
        // let _aux = [];
        // for (let tr of trList) {
        //     if (tr.classList.contains('roomName') && _aux.length > 0) {
        //         rooms.push(_aux);
        //         _aux = [];
        //     }

        //     _aux.push(tr);
        // }

        // for (let room of rooms) {
        //     const nodeName = room.filter(node => node.classList.contains('roomName'))[0];
        //     const nodePrice = room.filter(node => node.classList.contains('item'))[0];

        //     const name = nodeName.querySelector('.excerpt h5').innerText;
        //     const description = nodeName.querySelector('.description').innerText;
        //     const price = nodePrice.querySelector('.ratePriceTable').innerText;
        //     const slides = Array.prototype.slice.call(nodeName.querySelectorAll('.roomSlider .slide a img'));

        //     console.log({
        //         name,
        //         description,
        //         price,
        //         slides: slides.map(s => s.src)
        //     });
        // }
    }

    private async getLeCantonQuotationHTML(): Promise<string> {
        return fs.readFileSync('../html.html').toString();
        const { sessionId, cookieSession } = await this.getCookieAndSessionId();

        const quotationResponse = await axios("https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx", {
            method: "GET",
            params: {
                'ucUrl': 'SearchResultsByRoom',
                'NRooms': '1',
                'ad': '1',
                'ch': '0',
                'CheckIn': this.checkIn ? this.checkIn.format('DDMMYYYY') : '',
                'CheckOut': this.checkOut ? this.checkOut.format('DDMMYYYY') : '',
                'q': this.qValue,
                'sid': sessionId,
            },
            headers: {
                "cookie": "ASP.NET_SessionId=" + cookieSession
            },
        });

        fs.writeFileSync('./html.html', quotationResponse.data);

        return quotationResponse.data;
    }

    private async getCookieAndSessionId(): Promise<{ cookieSession: string, sessionId: string }> {
        const firstResponse = await axios('https://myreservations.omnibees.com/default.aspx', {
            params: {
                q: this.qValue
            },
            method: 'GET'
        });

        const html = firstResponse.data;
        const cookies = firstResponse.headers['set-cookie'];

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