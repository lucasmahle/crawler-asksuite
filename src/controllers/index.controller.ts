import { Request, Response } from 'express';

const IndexController = () => {
    const index = (req: Request, res: Response) => {
        res.json({
            success: true,
            data: {},
            message: '',
            errors: []
        });
    }

    return {
        index,
    }
}

export default IndexController;