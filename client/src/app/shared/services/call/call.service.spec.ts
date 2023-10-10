import { TestBed } from '@angular/core/testing'

import { CallService } from './call.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('CallService', () => {
    let service: CallService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        })
        service = TestBed.inject(CallService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
