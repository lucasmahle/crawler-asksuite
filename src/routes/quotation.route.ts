import { Router } from 'express';
import QuotationController from '../controllers/quotation.controller';


const QuotationRoute = (router: Router) => {
    const controller = QuotationController();

    router.post('/buscar', controller.searchValidation(), controller.search);
}

export default QuotationRoute;