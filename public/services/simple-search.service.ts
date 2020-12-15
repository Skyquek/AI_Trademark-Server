import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { SimpleSearchResult } from 'models/simple-search-result';
import { Trademark } from 'models/trademark';

import { Connections } from 'credentials';
import { utils } from 'utils';

@Injectable({
  providedIn: 'root',
})
export class SimpleSearchService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<SimpleSearchResult> {
    return this.http
      .get<SimpleSearchResult>(Connections.backEndURL + '/db/search', {
        params: new HttpParams().set('string', query),
      })
      .pipe(catchError(utils.handleError<SimpleSearchResult>('Simple Search')));
  }

  getRandomTrademark(): Observable<Trademark> {
    return this.http
      .get<Trademark>(Connections.backEndURL + '/db/random')
      .pipe(catchError(utils.handleError<Trademark>('Random Search')));
  }
}
