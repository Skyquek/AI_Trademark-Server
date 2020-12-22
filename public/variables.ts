const testingMode: boolean = false;

export interface backendCredentials {
  ip?: string;
  host?: string;
  port: number;
}

const backend: backendCredentials = {
  host: 'localhost',
  port: 3000,
};

const backendAB: backendCredentials = {
  host: 'localhost',
  port: 8999,
};

export class Credentials {
  static backend: backendCredentials = backend;
  static backendAB: backendCredentials = backendAB;
}

export class Connections {
  static backend: backendCredentials = backend;
  static backEndURL: string = 'http://' + backend.host + ':' + backend.port;
  static backendAB: backendCredentials = backendAB;
  static backEndAbURL: string = 'ws://' + backendAB.host + ':' + backendAB.port;
}
