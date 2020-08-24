import moment, { Moment } from 'moment';
import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';

import { QuotationService } from '../services/quotation.service';

interface SearchQuotationBody {
    checkin: Moment,
    checkout: Moment,
}

const QuotationController = () => {
    const searchValidation = () => {
        return [
            check('checkout')
                .notEmpty().withMessage('Check-out is required')
                .customSanitizer(value => moment(value, 'DD/MM/YYYY')),
            check('checkin')
                .notEmpty().withMessage('Check-in is required')
                .customSanitizer(value => moment(value, 'DD/MM/YYYY'))
                .custom((input, { req }) => {
                    const { body } = req;
                    if (input.isAfter(body.checkout)) {
                        throw new Error('Check-in cannot be after check-out');
                    }
                    return true;
                }),
        ];
    }

    const search = async (req: Request, res: Response) => {
        try {
            //https://myreservations.omnibees.com/default.aspx?q=5462#/&diff=false&CheckIn=23092020&CheckOut=24092020&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array()
                });

                return;
            }

            const input = <SearchQuotationBody>req.body;

            // Call service
            const quotationService = new QuotationService();
            await quotationService.fetchDataLeCanton();

            // Save cache

            // Return data
            res.json({
                success: true,
                data: input
            });
        } catch (error) {
            console.error(error);
            
            res.status(500).json({
                success: false,
                message: 'General error'
            });
        }
    }

    return {
        search,
        searchValidation
    }
}

export default QuotationController;