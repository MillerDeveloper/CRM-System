import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChatControlsComponent } from './chat-controls.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('ChatControlsComponent', () => {
    let component: ChatControlsComponent
    let fixture: ComponentFixture<ChatControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatControlsComponent],
            imports: [HttpClientTestingModule],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(ChatControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
