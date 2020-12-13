import { TestBed } from '@angular/core/testing';

import { AbCompareService } from './ab-compare.service';

describe('AbCompareService', () => {
  let service: AbCompareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbCompareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
