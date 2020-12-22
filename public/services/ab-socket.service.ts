import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

import {
  AbResultWs,
  AbResponse,
  WsMessage,
  ResultCount,
} from 'models/ab-result';
import { Connections } from 'variables';

@Injectable({
  providedIn: 'root',
})
export class AbSocketService {
  socket = webSocket(Connections.backEndAbURL); // abResultHistory: Observable<AbResultWs>
  abResult: Subject<AbResultWs> = new Subject<AbResultWs>();
  abFail: Subject<AbResultWs> = new Subject<AbResultWs>();
  abResultCount: Subject<number> = new Subject<number>();
  messages: Subject<string> = new Subject<string>();

  constructor() {
    this.socket.subscribe(
      // Called whenever there is a response from the server.
      (res: any) => {
        // console.log(res);

        if (res.type == 'message') {
          // Initialization message to test if ws server is alive
          console.log('Received message');
          this.messages.next(res.msg);

          console.log(this.messages);
        } else if (res.type == 'response') {
          // Response as in ab Result
          const response = res as AbResponse;

          response.results.forEach((result: AbResultWs) => {
            if (result.success) {
              this.abResult.next(result);
            } else {
              this.abFail.next(result);
            }
          });
        } else if (res.type == 'resultCount') {
          // Number of results to be received
          console.log(res);
          console.log('Expecting ' + res.count + ' results.');
          try {
            const resultCount = res as ResultCount;
            this.abResultCount.next(resultCount.count);
          } catch (err) {
            console.log(err);
          }
        }
      },
      (err: any) => {
        console.log(err);
      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        console.log('complete');
      } // Called when connection is closed (for whatever reason).
    );
  }

  sendMessage(msg: string) {
    this.socket.next({ searchString: msg });
  }

  close() {
    this.socket.complete();
  }
}
