import express, { Application } from 'express';

import IndexRoute from './index.route';
import QuotationRouter from './quotation.route';

const routesLoader = (app: Application) => {
    const router = express.Router();

    IndexRoute(router);
    QuotationRouter(router);

    app.use(router);
}

export default routesLoader;