import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { TranslateModule } from '@ngx-translate/core'
import { HttpClientModule } from '@angular/common/http'
import { MessageService } from 'primeng/api'
import { ServiceWorkerModule } from '@angular/service-worker'
import { isDevMode } from '@angular/core'

describe('AppComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                TranslateModule.forRoot(),
                HttpClientModule,
                ServiceWorkerModule.register('ngsw-worker.js', {
                    enabled: !isDevMode(),
                    registrationStrategy: 'registerWhenStable:30000'
                })
            ],
            declarations: [AppComponent],
            providers: [MessageService]
        }).compileComponents()
    })

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent)
        const app = fixture.componentInstance
        expect(app).toBeTruthy()
    })
})
