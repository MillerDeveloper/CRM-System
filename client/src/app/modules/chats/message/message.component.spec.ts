import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MessageComponent } from './message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('MessageComponent', () => {
    let component: MessageComponent
    let fixture: ComponentFixture<MessageComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MessageComponent],
            imports: [HttpClientTestingModule]
        }).compileComponents()

        fixture = TestBed.createComponent(MessageComponent)
        component = fixture.componentInstance
        component.config = {
            message: null
        }
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
