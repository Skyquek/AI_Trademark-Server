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

export interface AbResult {
  responseTime: number;
  results: {
    image_title1: string;
    image_title2: string;
    image_title_combined: string;
    percentage_difference: number;
    tm1: string;
    tm2: string;
    result_phonetic: string;
    confidence_phonetic: string;
    phonetic_similar: boolean;
    word1_list: Array<number>;
    word2_list: Array<number>;
  };
}

export interface AbResultWs extends AbResult {
  success: boolean;
}

// Responses to client
// Define possible responses
const responseTypes = <const>[
  "message",
  "response",
  "resultCount",
  "completion",
];

type Response = typeof responseTypes;

export interface wsResponseFundamental {
  type: typeof responseTypes[number];
}

export interface WsMessage extends wsResponseFundamental {
  msg: string;
}

export interface ResultCount extends wsResponseFundamental {
  count: number;
}

export interface AbResponse extends wsResponseFundamental {
  results: Array<AbResultWs>;
}
