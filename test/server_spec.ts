// Tests the server - uses existing server on the environment variable
// TEST_URL if that variable exists, otherwise we start our own

import * as fetch from "isomorphic-fetch";
import * as chai from "chai";
import { Server } from "http";

import { promiseAssert } from "./promiseAssert";
import { startServer } from "../src/server";
import { ParsedTimestamp } from "../src/timestamp";

/** URL we will use to reference the server */
let serverUrl: string;

/** The server to be closed if we started one */
let server: Server| null = null;

// Data we use in our tests
const unixTime: number = 1450137600;
const naturalTime: string = "December 15, 2015";
const exampleTS: ParsedTimestamp = {
  unix: 1450137600,
  natural: "December 15, 2015"
};
const nullTS: ParsedTimestamp = {
  unix: null,
  natural: null
};
let unixTimeUrl: string;
let naturalTimeUrl: string;
let rootUrl: string;

describe("Server tests",  () => {

  before(() => {

    if (process.env.SERVER) {
      serverUrl = process.env.SERVER;
    } else {
      const localPort: number = 8081;
      server = startServer(localPort);
      serverUrl = "http://localhost:" + localPort;
    }

    unixTimeUrl = serverUrl + "/" + unixTime;
    naturalTimeUrl = serverUrl + "/" + naturalTime;
    rootUrl = serverUrl + "/";

  });

  after(() => {

    if (server) {
      server.close();
    }

  });

  describe("/<unix-time>", () => {

    it("returns an ok status", (done: MochaDone) => {
      promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
        chai.expect(res.ok).to.be.true;
      });
    });

    it("returns an ok status", (done: MochaDone) => {
      promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
        chai.expect(res.ok).to.be.true;
      });
    });

    it("returns status 200", (done: MochaDone) => {
      promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
        chai.expect(res.status).to.equal(200);
      });
    });

    it("returns OK statusText", (done: MochaDone) => {
      promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
        chai.expect(res.statusText).to.equal("OK");
      });
    });

    it("returns a Content-Type header for json and utf8", (done: MochaDone) => {
      promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
        chai.expect(res.headers.get("Content-Type").toLowerCase()).to.equal("application/json; charset=utf-8");
      });
    });

    it("returns expected JSON result", (done: MochaDone) => {
      let p: Promise<ParsedTimestamp> =
        fetch(unixTimeUrl)
          .then((res: IResponse) => res.json());
      promiseAssert(p, done, (res: ParsedTimestamp): void => {
        chai.expect(res).to.deep.equal(exampleTS);
      });
    });

  });

  describe("/<natural-time>", () => {

    it("returns status 200", (done: MochaDone) => {
      promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
        chai.expect(res.status).to.equal(200);
      });
    });

    it("returns expected JSON result", (done: MochaDone) => {
      let p: Promise<ParsedTimestamp> =
        fetch(unixTimeUrl)
          .then((res: IResponse) => res.json());
      promiseAssert(p, done, (res: ParsedTimestamp): void => {
        chai.expect(res).to.deep.equal(exampleTS);
      });
    });

  });

  describe("/", () => {

    it("returns status 200", (done: MochaDone) => {
      promiseAssert(fetch(rootUrl), done, (res: IResponse): void => {
        chai.expect(res.status).to.equal(200);
      });
    });

    it("returns a Content-Type header for html and utf8", (done: MochaDone) => {
      promiseAssert(fetch(serverUrl), done, (res: IResponse): void => {
        chai.expect(res.headers.get("Content-Type").toLowerCase()).to.equal("text/html; charset=utf-8");
      });
    });

    it("returns expected html result", (done: MochaDone) => {
      let p: Promise<string> =
        fetch(rootUrl)
          .then((res: IResponse) => res.text());
      promiseAssert(p, done, (t: string): void => {
        const snippet: string = "<h1>FreeCodeCamp Back End Exercise: Timestamp Microservice</h1>";
        chai.expect(t).to.contain(snippet);
      });
    });

  });

  describe("Invalid inputs", () => {

    it("unknown path returns 404", (done: MochaDone) => {
      promiseAssert(fetch(serverUrl + "/123/456"), done, (res: IResponse): void => {
        chai.expect(res.status).to.equal(404);
      });
    });

    it("non-date returns null", (done: MochaDone) => {
      let p: Promise<ParsedTimestamp> =
        fetch(serverUrl + "/hello")
          .then((res: IResponse) => res.json());
      promiseAssert(p, done, (j: ParsedTimestamp): void => {
        chai.expect(j).to.deep.equal(nullTS);
      });
    });

    it("index.html returns null", (done: MochaDone) => {
      let p2: Promise<ParsedTimestamp> =
        fetch(serverUrl + "/index.html")
        .then((res: IResponse) => res.json());
      promiseAssert(p2, done, (j: ParsedTimestamp): void => {
        chai.expect(j).to.deep.equal(nullTS);
      });
    });

  });

});

