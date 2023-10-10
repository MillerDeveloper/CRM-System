import { TestBed } from '@angular/core/testing'

import { CollectionService } from './collection.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('CollectionService', () => {
    let service: CollectionService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        })
        service = TestBed.inject(CollectionService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
