import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoginComponent } from './login.component'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('LoginComponent', () => {
    let component: LoginComponent
    let fixture: ComponentFixture<LoginComponent>

    const fakeActivatedRoute = {
        snapshot: { data: {} }
    } as ActivatedRoute

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [RouterModule, HttpClientModule, TranslateModule.forRoot()],
            providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }, MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(LoginComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
