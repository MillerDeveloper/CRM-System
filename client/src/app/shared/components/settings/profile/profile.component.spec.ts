import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProfileComponent } from './profile.component'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('ProfileComponent', () => {
    let component: ProfileComponent
    let fixture: ComponentFixture<ProfileComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfileComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()],
            providers: [MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(ProfileComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
