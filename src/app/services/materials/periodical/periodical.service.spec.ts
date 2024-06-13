import { TestBed } from '@angular/core/testing';

import { PeriodicalService } from './periodical.service';

describe('PeriodicalService', () => {
  let service: PeriodicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
