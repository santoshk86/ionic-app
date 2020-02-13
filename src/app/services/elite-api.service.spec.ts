import { TestBed } from '@angular/core/testing';

import { EliteApi } from './elite-api.service';

describe('EliteApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EliteApi = TestBed.get(EliteApi);
    expect(service).toBeTruthy();
  });
});
