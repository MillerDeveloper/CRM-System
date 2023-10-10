import { ComponentFixture, TestBed } from '@angular/core/testing'

import { KanbanViewComponent } from './kanban-view.component'
import { HttpClientModule } from '@angular/common/http'

describe('KanbanViewComponent', () => {
    let component: KanbanViewComponent
    let fixture: ComponentFixture<KanbanViewComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KanbanViewComponent],
            imports: [HttpClientModule]
        }).compileComponents()

        fixture = TestBed.createComponent(KanbanViewComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
