import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MailComponent } from './mail.component'
import { DialogService } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

describe('MailComponent', () => {
    let component: MailComponent
    let fixture: ComponentFixture<MailComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MailComponent],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(MailComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
