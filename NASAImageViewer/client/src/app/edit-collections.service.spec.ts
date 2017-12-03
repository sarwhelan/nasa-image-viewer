import { TestBed, inject } from '@angular/core/testing';

import { EditCollectionsService } from './edit-collections.service';

describe('EditCollectionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditCollectionsService]
    });
  });

  it('should be created', inject([EditCollectionsService], (service: EditCollectionsService) => {
    expect(service).toBeTruthy();
  }));
});
