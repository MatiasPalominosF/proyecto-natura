import { TestBed } from '@angular/core/testing';

import { CicleService } from './cicle.service';

describe('CicleService', () => {
  let service: CicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
