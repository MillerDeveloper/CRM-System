import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TaskControlsComponent } from './task-controls.component'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'

describe('TaskControlsComponent', () => {
    let component: TaskControlsComponent
    let fixture: ComponentFixture<TaskControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaskControlsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig, DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(TaskControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
