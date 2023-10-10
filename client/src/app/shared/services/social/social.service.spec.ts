import { TestBed } from '@angular/core/testing'

import { SocialService } from './social.service'
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login'
import { GOOGLE_CLIENT_ID } from '@/shared/constants/system.constants'
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('SocialService', () => {
    let service: SocialService

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
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
                }
            ]
        })
        service = TestBed.inject(SocialService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
