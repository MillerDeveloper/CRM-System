import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CallComponent } from './call.component'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('CallComponent', () => {
    let component: CallComponent
    let fixture: ComponentFixture<CallComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CallComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()],
            providers: [MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(CallComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
