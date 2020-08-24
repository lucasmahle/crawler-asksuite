import axios from 'axios';

export class QuotationService {
    async fetchDataLeCanton() {
        try {
            const html = await this.getLeCantonQuotationHTML();

            console.log(html);
        } catch (error) {
            console.error(error);
        }
    }


    async getLeCantonQuotationHTML() {
        const qValue = '5462';
        const firstResponse = await axios('https://myreservations.omnibees.com/default.aspx?q=' + qValue, {
            method: 'GET'
        });

        const sessionInputMatch = /id="hfSID"\s+value="([a-z0-9\-]+)"/.exec(firstResponse.data);
        const sessionInputValue = sessionInputMatch ? sessionInputMatch[1] : '';

        const cookies = firstResponse.headers['set-cookie'];
        const sessionIdCookie = cookies.filter((cookie: string) => cookie.indexOf('SessionId') >= 0)[0];
        const sessionId = sessionIdCookie.replace('ASP.NET_SessionId=', '').replace('; path=/; HttpOnly', '');

        const quotationResponse = await axios("https://myreservations.omnibees.com/Handlers/ajaxLoader.ashx", {
            "params": {
                'ucUrl': 'SearchResultsByRoom',
                'CheckIn': '23092020',
                'CheckOut': '24092020',
                'NRooms': '1',
                'q': qValue,
                'sid': sessionInputValue,
                'ad': '1',
                'ch': '0'
            },
            "headers": {
                "cookie": "ASP.NET_SessionId=" + sessionId
            },
            "method": "GET",
        });

        return quotationResponse.data;
    }
}