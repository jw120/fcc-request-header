import * as Express from "express";
import { getClientIp } from "request-ip";

interface WhoAmI {
  ipaddress: string;
  language: string;
  software: string;
}

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
    language: beforeFirstSeperator(req.headers["accept-language"]),
    software: betweenFirstParens(req.headers["user-agent"])
  };
  res.send(whoami);
});

app.use("/", router);

let port: number = process.env.PORT || 8080;
app.listen(port);
console.log("Request header server launched on port " + port);

/** Return the portion of a string upto the first comma or semi-colon */
function beforeFirstSeperator(s: string): string {
    let matches: RegExpExecArray | null = /^[^,;]*/.exec(s);
    return matches ? matches[0] : "";
}

/** Return the contents of the string's first pair of parentheses */
function betweenFirstParens(s: string): string {
    let matches: RegExpExecArray | null = /\(([^)]*)\)/.exec(s);
    return matches ? matches[1] : "";
}
