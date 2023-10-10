import {HttpClientModule} from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ChatsComponent } from './chats.component'
import { DialogService } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('ChatsComponent', () => {
    let component: ChatsComponent
    let fixture: ComponentFixture<ChatsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatsComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()],
            providers: [DialogService, MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(ChatsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
