import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ConnectionsComponent } from './connections.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'
import { DatePipe } from '@angular/common'
import { DialogService } from 'primeng/dynamicdialog'

describe('ConnectionsComponent', () => {
    let component: ConnectionsComponent
    let fixture: ComponentFixture<ConnectionsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ConnectionsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService, DatePipe, DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(ConnectionsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
