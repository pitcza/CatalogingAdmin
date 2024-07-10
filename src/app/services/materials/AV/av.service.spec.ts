import { TestBed } from '@angular/core/testing';

import { AVService } from './av.service';

describe('AVService', () => {
  let service: AVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
