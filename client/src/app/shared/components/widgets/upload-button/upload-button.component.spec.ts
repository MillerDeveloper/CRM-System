import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UploadButtonComponent } from './upload-button.component'
import { TranslateModule } from '@ngx-translate/core'

describe('UploadButtonComponent', () => {
    let component: UploadButtonComponent
    let fixture: ComponentFixture<UploadButtonComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UploadButtonComponent],
            imports: [TranslateModule.forRoot()]
        }).compileComponents()

        fixture = TestBed.createComponent(UploadButtonComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
