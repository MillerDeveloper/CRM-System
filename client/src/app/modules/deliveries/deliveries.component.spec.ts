import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DeliveriesComponent } from './deliveries.component'
import { DialogService } from 'primeng/dynamicdialog'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('DeliveriesComponent', () => {
    let component: DeliveriesComponent
    let fixture: ComponentFixture<DeliveriesComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeliveriesComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()],
            providers: [DialogService, MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(DeliveriesComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
