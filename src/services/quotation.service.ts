import { Moment } from "moment";

import { LeCantonFetchService } from "./le-canton/fetch.service";
import { LeCantonExtractService } from "./le-canton/extract.service";
import { LeCantonImageService } from "./le-canton/image.service";
import { Quotation } from "../models/quotation.model";

export class QuotationService {

    async fetchDataLeCanton(checkin: Moment, checkout: Moment): Promise<Quotation[]> {
        const fetchService = new LeCantonFetchService();
        const extractService = new LeCantonExtractService();
        const imageService = new LeCantonImageService();

        fetchService.setCheckIn(checkin);
        fetchService.setCheckOut(checkout);

        const html = await fetchService.getLeCantonQuotationHTML();

        extractService.setHtml(html);
        const quotations = extractService.extractQuotationFromHtml();

        return await imageService.asyncStoreRoomsImages(quotations);
    }
}