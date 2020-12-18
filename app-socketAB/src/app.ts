import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
const axios = require("axios");

import {
  ExtWebSocket,
  ClientReq,
  TrademarkAB,
  AbResult,
} from "models/abSocket";
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

function abCompare(
  trademark: TrademarkAB,
  searchString: string
): Promise<AbResult> {
  return new Promise<AbResult>((resolve, reject) => {
    console.log(`Comparing ${searchString} with ${trademark.brand}`);
    axios
      .get(dbApiServer + "ab/compare", {
        params: {
          q1: searchString,
          q2: trademark.brand,
        },
      })
      .then((res: AxiosResponse) => {
        console.log("Response for " + searchString + " vs " + trademark.brand);
        resolve(res.data as AbResult);
      })
      .catch((err: any) => {
        if (err.response) {
          // If server gives a response
          const responseString: string =
            err.response.status +
            ": " +
            err.response.statusText +
            " - " +
            err.request.path;

          console.log(responseString);
          reject(responseString);
        } else {
          // If server does not give a response
          console.log(err);
          reject({ success: false });
        }
      });
  });
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
          one_by_one(trademarks, (trademark: TrademarkAB) => {
            return abCompare(trademark, parsedData.searchString).then(
              (res: AbResult) => {
                if (res.success) {
                  ws.send(JSON.stringify(res));
                } else {
                  // TODO: If fail, send to an array to rerun after everything is done
                  ws.send(
                    `Comparison between ${trademark} and ${parsedData.searchString} failed.`
                  );
                }
              }
            );
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
