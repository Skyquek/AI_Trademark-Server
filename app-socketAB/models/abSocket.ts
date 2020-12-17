// Accepts event emitted by client when deciding to search for something.
export interface ClientReq {
  searchString: string;
}

import * as WebSocket from "ws";
export interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}

// Expected response from database request on trademark
export interface TrademarkAB {
  number: string;
  brand: string;
}
