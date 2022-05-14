import { TestBed } from '@angular/core/testing';

import { ProduceService } from './produce.service';

describe('ProduceService', () => {
  let service: ProduceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProduceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
