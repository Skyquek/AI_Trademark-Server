// Define possible responses
const responseTypes = <const>[
  'message',
  'response',
  'resultCount',
  'completion',
];

type Response = typeof responseTypes;

interface wsResponseFundamental {
  type: typeof responseTypes[number];
}

export interface AbResult {
  responseTime: number;
  results: {
    image_title1: string;
    image_title1_3d: string;
    image_title2: string;
    image_title2_3d: string;
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

export interface WsMessage extends wsResponseFundamental {
  msg: string;
}

export interface ResultCount extends wsResponseFundamental {
  count: number;
}

export interface AbResponse extends wsResponseFundamental {
  results: Array<AbResultWs>;
}
