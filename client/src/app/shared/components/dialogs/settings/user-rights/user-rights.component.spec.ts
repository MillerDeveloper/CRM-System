import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserRightsComponent } from './user-rights.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'

describe('UserRightsComponent', () => {
    let component: UserRightsComponent
    let fixture: ComponentFixture<UserRightsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserRightsComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()]
        }).compileComponents()

        fixture = TestBed.createComponent(UserRightsComponent)
        component = fixture.componentInstance
        component.config = {
            modalMode: 'collectionsRights',
            rights: {
                system: {},
                collections: []
            }
        }
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
