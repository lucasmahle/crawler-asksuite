import cheerio from 'cheerio';

import { Quotation } from "../../models/quotation.model";

export class LeCantonExtractService {
    private html: string = '';
    private $!: CheerioStatic;

    setHtml(html: string) {
        this.html = html;
    }

    extractQuotationFromHtml(): Quotation[] {
        this.$ = cheerio.load(this.html);

        const rooms = this.getRoomsTableRows();
        const quotations: Quotation[] = [];

        for (let room of rooms) {
            const nodeInfo = room.filter(node => node.attribs.class.indexOf('roomName') >= 0)[0];
            const nodePrices = room.filter(node => node.attribs.class.indexOf('item') >= 0)[0];

            const name = this.extractRoomName(nodeInfo);
            const description = this.extractRoomDescription(nodeInfo);
            const price = this.extractRoomPrice(nodePrices);
            const slides = this.extractRoomSlideImage(nodeInfo);

            quotations.push(new Quotation({
                name,
                description,
                price,
                images: slides
            }));
        }

        return quotations;
    }

    private extractRoomSlideImage(node: CheerioElement): string[] {
        const slides: string[] = [];

        this.$('.roomSlider .slide a img', node).each((i, img) => {
            slides.push(img.attribs.src);
        });

        return slides;
    }

    private extractRoomPrice(node: CheerioElement): number {
        const priceRaw = this.$('.ratePriceTable', node).text();
        const priceOnlyNumbers = (priceRaw.match(/\d+|\,/g) || ['']).join('');
        const priceWithouComma = priceOnlyNumbers.replace(',', '.');

        return parseFloat(priceWithouComma);
    }

    private extractRoomDescription(node: CheerioElement): string {
        const description = this.$('.description', node).text();
        return description.trim();
    }

    private extractRoomName(node: CheerioElement): string {
        const name = this.$('.excerpt h5', node).text();
        return name.trim();
    }

    private getRoomsTableRows(): CheerioElement[][] {
        const table = this.$('.maintable > tbody > tr');

        const rooms: CheerioElement[][] = [];
        let _aux: CheerioElement[] = [];

        table.each((i, tr) => {
            if (tr.attribs.class.indexOf('roomName') >= 0 && _aux.length > 0) {
                rooms.push(_aux);
                _aux = [];
            }

            _aux.push(tr);
        });

        return rooms;
    }
}