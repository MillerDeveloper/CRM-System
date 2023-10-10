import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UsersComponent } from './users.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DialogService } from 'primeng/dynamicdialog'
import { TranslateModule } from '@ngx-translate/core'

describe('UsersComponent', () => {
    let component: UsersComponent
    let fixture: ComponentFixture<UsersComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UsersComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [DialogService]
        }).compileComponents()

        fixture = TestBed.createComponent(UsersComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
