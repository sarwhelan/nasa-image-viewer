import { TestBed, inject } from '@angular/core/testing';

import { LoadUserCollectionsService } from './load-user-collections.service';

describe('LoadUserCollectionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadUserCollectionsService]
    });
  });

  it('should be created', inject([LoadUserCollectionsService], (service: LoadUserCollectionsService) => {
    expect(service).toBeTruthy();
  }));
});
