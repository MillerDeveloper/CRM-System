import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SiteControlsComponent } from './site-controls.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'

describe('SiteControlsComponent', () => {
    let component: SiteControlsComponent
    let fixture: ComponentFixture<SiteControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SiteControlsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(SiteControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
