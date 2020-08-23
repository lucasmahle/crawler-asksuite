import helmet from "helmet";

import app from "../app";
import requestHeadersMiddleware from "../lib/request-headers";

app.use(helmet()); 
app.use(requestHeadersMiddleware());

app.disable("x-powered-by");

const server = app.listen(3000, () =>
  console.log("Starting ExpressJS server on Port 3000")
);

export default server;