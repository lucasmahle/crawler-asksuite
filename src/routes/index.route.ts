import { Router } from 'express';
import IndexController from '../controllers/index.controller';


const IndexRoute = (router: Router) => {
    const controller = IndexController();

    router.get('/', controller.index);
}

export default IndexRoute;