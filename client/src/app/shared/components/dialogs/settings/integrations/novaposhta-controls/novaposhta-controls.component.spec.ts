import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NovaposhtaControlsComponent } from './novaposhta-controls.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DatePipe } from '@angular/common'

describe('NovaposhtaControlsComponent', () => {
    let component: NovaposhtaControlsComponent
    let fixture: ComponentFixture<NovaposhtaControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NovaposhtaControlsComponent],
            imports: [HttpClientTestingModule],
            providers: [DynamicDialogRef, DynamicDialogConfig, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(NovaposhtaControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
