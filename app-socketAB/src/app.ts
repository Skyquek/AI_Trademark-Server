import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
const axios = require("axios");

import { ExtWebSocket, ClientReq, TrademarkAB } from "models/abSocket";
import { AxiosResponse } from "axios";

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wsServer = new WebSocket.Server({ server });

/**Yes I know this is a security issue, but I'll wait till
 * everything is done, and migrate existing express app on
 * js to ts. The migration of credentials will be done then.
 * */
const dbAllKey = "645611c5335a769b08bee5d25e433e286db18d9d";
const dbApiServer = "http://localhost:3000/";
const aiBackend = "http://128.199.159.89:7000/";

/**
 * Runs the promises one by one, waiting it to solve before running the next.
 * Source: https://stackoverflow.com/questions/24586110/resolve-promises-one-after-another-i-e-in-sequence
 * @param {array} objects_array The array of objects to be iterated across.
 * @param {function} iterator Function to run across the iterations.
 * @param {callback} callback
 * @return {Promise[]}
 */
function one_by_one(
  objects_array: Array<any>,
  iterator: Function,
  callback?: any
) {
  var start_promise = objects_array.reduce((prom, object) => {
    return prom.then(() => {
      return iterator(object);
    });
  }, Promise.resolve()); // initialize with a resolved promise

  if (callback) {
    start_promise.then(callback);
  } else {
    return start_promise;
  }
}

wsServer.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
  const extWs = ws as ExtWebSocket;
  extWs.isAlive = true;

  // To handle client keepalive response
  ws.on("pong", () => {
    extWs.isAlive = true;
  });

  // On connect, do this
  ws.send("Hi there, I am a WebSocket server");

  // On the existence of incoming data, do this
  ws.on("message", (data: string) => {
    // Acknowledge to client that we got the data
    let parsedData: ClientReq;
    try {
      parsedData = JSON.parse(data) as ClientReq;
      ws.send(JSON.stringify(parsedData.searchString));
    } catch (err) {
      console.log(err);
      return;
    }

    // Get list of database items
    try {
      axios
        .get(dbApiServer + "db/abAll/" + dbAllKey)
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .then((trademarks: Array<TrademarkAB>) => {
          console.log("Start comparing");
          var counter = 0;
          one_by_one(trademarks, (trademark: TrademarkAB) => {
            setTimeout(() => {
              axios
                .get(dbApiServer + "ab/compare", {
                  params: {
                    q1: parsedData.searchString,
                    q2: trademark.brand,
                  },
                })
                .then((res: AxiosResponse) => {
                  console.log(
                    "Response for " +
                      res.data.results.tm1 +
                      " vs " +
                      res.data.results.tm2
                  );
                  ws.send(JSON.stringify(res.data));
                })
                .catch((err: any) => {
                  console.log(err);
                });
            }, counter++ * 4000);
          });
        });
    } catch (err) {
      ws.send(err.stringify());
    }
  });

  ws.on("error", (err) => {
    console.warn(`Client disconnected - reason: ${err}`);
  });
});

setInterval(() => {
  wsServer.clients.forEach((ws: WebSocket) => {
    const extWs = ws as ExtWebSocket;

    if (!extWs.isAlive) return ws.terminate();

    extWs.isAlive = false;
    ws.ping(null, undefined);
  });
}, 10000);

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
