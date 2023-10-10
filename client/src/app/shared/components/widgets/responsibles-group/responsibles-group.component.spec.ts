import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResponsiblesGroupComponent } from './responsibles-group.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('ResponsiblesGroupComponent', () => {
    let component: ResponsiblesGroupComponent
    let fixture: ComponentFixture<ResponsiblesGroupComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ResponsiblesGroupComponent],
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(ResponsiblesGroupComponent)
        component = fixture.componentInstance
        component.config = {
            responsibles: [],
            mapBy: ''
        }
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
