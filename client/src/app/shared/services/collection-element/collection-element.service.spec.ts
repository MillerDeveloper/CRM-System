import { TestBed } from '@angular/core/testing';

import { CollectionElementService } from './collection-element.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

describe('CollectionElementService', () => {
  let service: CollectionElementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [MessageService, DatePipe]
    });
    service = TestBed.inject(CollectionElementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
