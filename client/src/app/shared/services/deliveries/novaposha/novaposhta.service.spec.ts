import { TestBed } from '@angular/core/testing'

import { NovaposhtaService } from './novaposhta.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DatePipe } from '@angular/common'

describe('NovaposhtaService', () => {
    let service: NovaposhtaService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DatePipe]
        })
        service = TestBed.inject(NovaposhtaService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
