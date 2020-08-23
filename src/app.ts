import express from 'express';
import routesLoader from './routes';

const app = express();

routesLoader(app);

export default app;
