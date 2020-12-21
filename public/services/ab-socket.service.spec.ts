import { TestBed } from '@angular/core/testing';

import { AbSocketService } from './ab-socket.service';

describe('AbSocketService', () => {
  let service: AbSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
