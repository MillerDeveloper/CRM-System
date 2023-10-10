import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BinotelControlsComponent } from './binotel-controls.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

describe('BinotelControlsComponent', () => {
    let component: BinotelControlsComponent
    let fixture: ComponentFixture<BinotelControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BinotelControlsComponent],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(BinotelControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
