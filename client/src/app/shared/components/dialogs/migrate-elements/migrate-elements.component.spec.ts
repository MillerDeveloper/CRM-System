import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MigrateElementsComponent } from './migrate-elements.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'

describe('MigrateElementsComponent', () => {
    let component: MigrateElementsComponent
    let fixture: ComponentFixture<MigrateElementsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MigrateElementsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(MigrateElementsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
