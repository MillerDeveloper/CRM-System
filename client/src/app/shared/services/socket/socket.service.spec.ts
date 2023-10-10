import { TestBed } from '@angular/core/testing'

import { SocketService } from './socket.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('SocketService', () => {
    let service: SocketService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        })
        service = TestBed.inject(SocketService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
