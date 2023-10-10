import { TestBed } from '@angular/core/testing'

import { DeliveryService } from './delivery.service'
import { HttpClientModule } from '@angular/common/http'

describe('DeliveryService', () => {
    let service: DeliveryService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule]
        })
        service = TestBed.inject(DeliveryService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
