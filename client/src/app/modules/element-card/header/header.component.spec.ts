import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HeaderComponent } from './header.component'
import { TranslateModule } from '@ngx-translate/core'
import { ConfirmationService } from 'primeng/api'

describe('HeaderComponent', () => {
    let component: HeaderComponent
    let fixture: ComponentFixture<HeaderComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [TranslateModule.forRoot()],
            providers: [ConfirmationService]
        }).compileComponents()

        fixture = TestBed.createComponent(HeaderComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
