import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TasksComponent } from './tasks.component'
import { DialogService } from 'primeng/dynamicdialog'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'

describe('TasksComponent', () => {
    let component: TasksComponent
    let fixture: ComponentFixture<TasksComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TasksComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()],
            providers: [DialogService, MessageService, DatePipe]
        }).compileComponents()

        fixture = TestBed.createComponent(TasksComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
