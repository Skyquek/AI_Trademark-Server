import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AbResult } from 'models/ab-result';

import { Connections } from 'credentials';

@Injectable({
  providedIn: 'root',
})
export class AbCompareService {
  constructor(private http: HttpClient) {}

  compare(stringA: string, stringB: string): Observable<AbResult> {
    return this.http.get<AbResult>(Connections.backEndURL + '/ab/compare', {
      params: new HttpParams().set('q1', stringA).set('q2', stringB),
    });
  }
}
