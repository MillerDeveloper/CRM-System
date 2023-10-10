import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DefaultGuard } from './default.guard'
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

describe('DefaultGuard', () => {
    let guard: DefaultGuard

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService]
        })
        guard = TestBed.inject(DefaultGuard)
    })

    it('should be created', () => {
        expect(guard).toBeTruthy()
    })
})
