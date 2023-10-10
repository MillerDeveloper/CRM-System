import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AddFieldOverlayComponent } from './add-field-overlay.component'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'

describe('AddFieldOverlayComponent', () => {
    let component: AddFieldOverlayComponent
    let fixture: ComponentFixture<AddFieldOverlayComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddFieldOverlayComponent],
            imports: [HttpClientModule, TranslateModule.forRoot()]
        }).compileComponents()

        fixture = TestBed.createComponent(AddFieldOverlayComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
