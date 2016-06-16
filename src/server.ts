/** Provides function to create and start an Express server */

import * as Express from "express";
import { Server } from "http";
import { getClientIp } from "request-ip";

interface WhoAmI {
  ipaddress: string;
  language: string;
  software: string;
}

/** Create and start a timestamp server on the given port (which is returned) */
export function startServer(port: number): Server {

  const app: Express.Application = Express();

  const router: Express.Router = Express.Router();
  router.get("/", function (req: Express.Request, res: Express.Response): void {
    let sendFileOptions: any = {
      root: __dirname
    };
    res.sendFile("/root.html", sendFileOptions);
  });
  router.get("/api/whoami", function(req: Express.Request, res: Express.Response): void {
    let whoami: WhoAmI = {
      ipaddress: getClientIp(req),
      language: beforeFirstComma(req.headers["accept-language"]),
      software: betweenFirstParens(req.headers["user-agent"])
    };
    res.send(whoami);
  });

  app.use("/", router);

  return app.listen(port);

}

// Helper functions
function beforeFirstComma(s: string): string {
    let matches: RegExpExecArray | null = /^[^,]*/.exec(s);
    return matches ? matches[0] : "";
}

function betweenFirstParens(s: string): string {
    let matches: RegExpExecArray | null = /\(([^)]*)\)/.exec(s);
    return matches ? matches[1] : "";
}
