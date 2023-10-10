import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ElementCardComponent } from './element-card.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'
import { RouterTestingModule } from '@angular/router/testing'
import { DialogService } from 'primeng/dynamicdialog'

describe('ElementCardComponent', () => {
    let component: ElementCardComponent
    let fixture: ComponentFixture<ElementCardComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ElementCardComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot(), RouterTestingModule],
            providers: [MessageService, DatePipe, DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(ElementCardComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
