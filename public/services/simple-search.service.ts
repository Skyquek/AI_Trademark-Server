import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SimpleSearchResult } from 'models/simple-search-result';

import { Connections } from 'credentials';

@Injectable({
  providedIn: 'root',
})
export class SimpleSearchService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<SimpleSearchResult> {
    return this.http.get<SimpleSearchResult>(
      Connections.backEndURL + '/db/query',
      {
        params: new HttpParams().set('string', query),
      }
    );
  }
}
