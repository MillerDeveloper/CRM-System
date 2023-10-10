import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DefaultComponent } from './default.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ServiceWorkerModule, SwPush } from '@angular/service-worker'
import { isDevMode } from '@angular/core'
import { TranslateModule } from '@ngx-translate/core'
import { MessageService } from 'primeng/api'

describe('DefaultComponent', () => {
    let component: DefaultComponent
    let fixture: ComponentFixture<DefaultComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DefaultComponent],
            imports: [
                HttpClientTestingModule,
                ServiceWorkerModule.register('ngsw-worker.js', {
                    enabled: !isDevMode(),
                    registrationStrategy: 'registerWhenStable:30000'
                }),
                TranslateModule.forRoot()
            ],
            providers: [MessageService]
        }).compileComponents()

        fixture = TestBed.createComponent(DefaultComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
