import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConnectElementFieldsComponent } from './connect-element-fields.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientModule } from '@angular/common/http'

describe('ConnectElementFieldsComponent', () => {
    let component: ConnectElementFieldsComponent
    let fixture: ComponentFixture<ConnectElementFieldsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConnectElementFieldsComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(ConnectElementFieldsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
