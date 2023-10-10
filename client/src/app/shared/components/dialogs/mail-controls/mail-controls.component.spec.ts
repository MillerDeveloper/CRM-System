import { ComponentFixture, TestBed } from '@angular/core/testing'

import { MailControlsComponent } from './mail-controls.component'
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login'
import { GOOGLE_CLIENT_ID } from '@/shared/constants/system.constants'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { RouterTestingModule } from '@angular/router/testing'

describe('MailControlsComponent', () => {
    let component: MailControlsComponent
    let fixture: ComponentFixture<MailControlsComponent>

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MailControlsComponent],
            imports: [HttpClientTestingModule, RouterTestingModule],
            providers: [
                {
                    provide: 'SocialAuthServiceConfig',
                    useValue: {
                        autoLogin: false,
                        providers: [
                            {
                                id: GoogleLoginProvider.PROVIDER_ID,
                                provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
                            }
                        ],
                        onError: (error: Error) => {
                            console.error(error)
                        }
                    } as SocialAuthServiceConfig
                },
                DynamicDialogRef,
                DynamicDialogConfig
            ]
        }).compileComponents()

        fixture = TestBed.createComponent(MailControlsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
