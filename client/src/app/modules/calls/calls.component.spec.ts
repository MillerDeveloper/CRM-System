import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CallsComponent } from './calls.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('CallsComponent', () => {
    let component: CallsComponent
    let fixture: ComponentFixture<CallsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CallsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(CallsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
