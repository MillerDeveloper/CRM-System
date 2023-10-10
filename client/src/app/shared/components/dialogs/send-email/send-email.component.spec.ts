import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SendEmailComponent } from './send-email.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'

describe('SendEmailComponent', () => {
    let component: SendEmailComponent
    let fixture: ComponentFixture<SendEmailComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SendEmailComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(SendEmailComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
