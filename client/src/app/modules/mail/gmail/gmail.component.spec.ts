import { ComponentFixture, TestBed } from '@angular/core/testing'

import { GmailComponent } from './gmail.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('GmailComponent', () => {
    let component: GmailComponent
    let fixture: ComponentFixture<GmailComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GmailComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(GmailComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
