import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RegisterComponent } from './register.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('RegisterComponent', () => {
    let component: RegisterComponent
    let fixture: ComponentFixture<RegisterComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RegisterComponent],
            imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(RegisterComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
