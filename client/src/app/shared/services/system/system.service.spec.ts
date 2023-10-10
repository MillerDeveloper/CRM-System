import { TestBed } from '@angular/core/testing'

import { SystemService } from './system.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('SystemService', () => {
    let service: SystemService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService]
        })
        service = TestBed.inject(SystemService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
