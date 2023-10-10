import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InviteUsersComponent } from './invite-users.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'

describe('InviteUsersComponent', () => {
    let component: InviteUsersComponent
    let fixture: ComponentFixture<InviteUsersComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InviteUsersComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(InviteUsersComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
