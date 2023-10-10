import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ImportElementsComponent } from './import-elements.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('ImportElementsComponent', () => {
    let component: ImportElementsComponent
    let fixture: ComponentFixture<ImportElementsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ImportElementsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig, MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(ImportElementsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
