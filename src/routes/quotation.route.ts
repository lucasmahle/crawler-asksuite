import { Application, Request, Response, NextFunction } from "express";
import QuotationController from "src/controllers/quotation.controller";


const route = (app: Application) => {
    const controller = QuotationController();

    app.post("/buscar", (req: Request, res: Response, next: NextFunction) => controller.search(req, res, next));
}

export default route;