import { TestBed } from '@angular/core/testing'

import { BinotelService } from './binotel.service'
import { HttpClientModule } from '@angular/common/http'

describe('BinotelService', () => {
    let service: BinotelService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        })
        service = TestBed.inject(BinotelService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
