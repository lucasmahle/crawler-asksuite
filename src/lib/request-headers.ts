import { Request, Response, NextFunction } from 'express';

const requestHeadersMiddleware = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', 'false');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-Width, Content-Type, Accept, Authorization');

        next();
    }
}

export default requestHeadersMiddleware;