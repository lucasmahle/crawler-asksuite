import { Request, Response, NextFunction } from 'express';

const QuotationController = () => {
    const search = (req: Request, res: Response, next: NextFunction) => {
        res.json({
            success: true
        });
    }

    return {
        search,
    }
}

export default QuotationController;