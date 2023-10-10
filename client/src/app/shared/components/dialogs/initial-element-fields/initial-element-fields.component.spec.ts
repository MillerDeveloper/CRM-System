import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InitialElementFieldsComponent } from './initial-element-fields.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'

describe('InitialElementFieldsComponent', () => {
    let component: InitialElementFieldsComponent
    let fixture: ComponentFixture<InitialElementFieldsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InitialElementFieldsComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(InitialElementFieldsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
