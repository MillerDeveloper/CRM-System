import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UsersMultiselectComponent } from './users-multiselect.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FormGroup } from '@angular/forms'

describe('UsersMultiselectComponent', () => {
    let component: UsersMultiselectComponent
    let fixture: ComponentFixture<UsersMultiselectComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UsersMultiselectComponent],
            imports: [HttpClientTestingModule]
        }).compileComponents()

        fixture = TestBed.createComponent(UsersMultiselectComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
