/** Simple top-level application just starts the server */

import { startServer } from "./server";

let port: number = process.env.PORT || 8080;
startServer(port);
console.log("Timestamp server launched on port " + port);


