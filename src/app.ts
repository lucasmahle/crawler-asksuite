import express from 'express';
import bodyParser from 'body-parser';

import routesLoader from './routes';
import { STORE_FOLDER } from './config/config';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/store', express.static(STORE_FOLDER));

routesLoader(app);

export default app;
