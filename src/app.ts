import express from 'express';
import bodyParser from 'body-parser';

import routesLoader from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routesLoader(app);

export default app;
