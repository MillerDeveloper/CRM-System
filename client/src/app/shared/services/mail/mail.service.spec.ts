import { TestBed } from '@angular/core/testing';

import { MailService } from './mail.service';
import { HttpClientModule } from '@angular/common/http';

describe('MailService', () => {
  let service: MailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [HttpClientModule]
    });
    service = TestBed.inject(MailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
