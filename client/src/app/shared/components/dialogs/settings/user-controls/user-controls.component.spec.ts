import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserControlsComponent } from './user-controls.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('UserControlsComponent', () => {
    let component: UserControlsComponent
    let fixture: ComponentFixture<UserControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserControlsComponent],
            imports: [HttpClientTestingModule],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(UserControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
