import { TestBed } from '@angular/core/testing';

import { SimpleSearchService } from './simple-search.service';

describe('SimpleSearchService', () => {
  let service: SimpleSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
