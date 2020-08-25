import { LeCantonService } from "./hotels/le-canton.service";
import { Moment } from "moment";

export class QuotationService {
    async fetchDataLeCanton(checkin: Moment, checkout: Moment) {
        try {
            const leCantonService = new LeCantonService();

            leCantonService.setCheckIn(checkin);
            leCantonService.setCheckOut(checkout);
            await leCantonService.fetchDataLeCanton();

        } catch (error) {
            console.error(error);
        }
    }
}