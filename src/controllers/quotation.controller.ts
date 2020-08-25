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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.array()
                });

                return;
            }

            const input = <SearchQuotationBody>req.body;

            const quotationService = new QuotationService();
            const quotation = await quotationService.fetchDataLeCanton(input.checkin, input.checkout);

            res.json({
                success: true,
                data: quotation
            });
        } catch (error) {
            console.error(error);
            
            res.status(500).json({
                success: false,
                message: 'Something wrong happened'
            });
        }
    }

    return {
        search,
        searchValidation
    }
}

export default QuotationController;