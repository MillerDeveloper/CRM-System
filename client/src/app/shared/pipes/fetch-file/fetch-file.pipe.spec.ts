import { SystemService } from '@/shared/services/system/system.service'
import { TestBed } from '@angular/core/testing'
import { FetchFilePipe } from './fetch-file.pipe'
import { CookieService } from 'ngx-cookie-service'

describe('FetchFilePipe', () => {
    let cookieService: CookieService

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SystemService]
        })
    })

    it('create an instance', () => {
        const pipe = new FetchFilePipe(cookieService)
        expect(pipe).toBeTruthy()
    })
})
