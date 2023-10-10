import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CreateViewOptionComponent } from './create-view-option.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

describe('CreateViewOptionComponent', () => {
    let component: CreateViewOptionComponent
    let fixture: ComponentFixture<CreateViewOptionComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateViewOptionComponent],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(CreateViewOptionComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
