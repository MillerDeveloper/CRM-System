import {TestBed} from '@angular/core/testing'
import { SystemService } from '@/shared/services/system/system.service'
import { GetFirstLetterPipe } from './get-first-letter.pipe'

describe('GetFirstLetterPipe', () => {
    let systemService: SystemService

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SystemService]
        })
    })

    it('create an instance', () => {
        const pipe = new GetFirstLetterPipe(systemService)
        expect(pipe).toBeTruthy()
    })
})
