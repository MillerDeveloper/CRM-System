import { MailService } from '@/shared/services/mail/mail.service'
import { SocialAuthService } from '@abacritt/angularx-social-login'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class SocialService {
    constructor(
        private readonly socialAuthService: SocialAuthService,
        private readonly mailService: MailService
    ) {}

    auth2: any

    signInWith(service: string): void {
        switch (service) {
            case 'google': {
                this.mailService.getAuthUrl().subscribe({
                    next: (response: { url: string }) => {
                        location.href = response.url
                    }
                })

                break
            }
        }
    }

    signOut(): void {
        this.socialAuthService.signOut()
    }
}
