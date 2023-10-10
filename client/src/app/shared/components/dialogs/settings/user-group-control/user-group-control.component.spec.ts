import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserGroupControlComponent } from './user-group-control.component'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'

describe('UserGroupControlComponent', () => {
    let component: UserGroupControlComponent
    let fixture: ComponentFixture<UserGroupControlComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserGroupControlComponent],
            imports: [TranslateModule.forRoot()],
            providers: [DynamicDialogRef, DynamicDialogConfig]
        }).compileComponents()

        fixture = TestBed.createComponent(UserGroupControlComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
