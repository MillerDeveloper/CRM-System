import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DeliveryControlsComponent } from './delivery-controls.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

describe('DeliveryControlsComponent', () => {
    let component: DeliveryControlsComponent
    let fixture: ComponentFixture<DeliveryControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeliveryControlsComponent],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(DeliveryControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
