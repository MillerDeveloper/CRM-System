import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConnectToElementComponent } from './connect-to-element.component'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('ConnectToElementComponent', () => {
    let component: ConnectToElementComponent
    let fixture: ComponentFixture<ConnectToElementComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConnectToElementComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [
                DynamicDialogRef,
                DynamicDialogConfig,
                DialogService,
                MessageService,
                DatePipe
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(ConnectToElementComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
