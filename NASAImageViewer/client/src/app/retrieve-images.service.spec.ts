import { TestBed, inject } from '@angular/core/testing';

import { RetrieveImagesService } from './retrieve-images.service';

describe('RetrieveImagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetrieveImagesService]
    });
  });

  it('should be created', inject([RetrieveImagesService], (service: RetrieveImagesService) => {
    expect(service).toBeTruthy();
  }));
});
