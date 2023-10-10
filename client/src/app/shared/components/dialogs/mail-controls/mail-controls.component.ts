import { MailService } from '@/shared/services/mail/mail.service'
import { SocialService } from '@/shared/services/social/social.service'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'
import * as moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
@Component({
    selector: 'app-mail-controls',
    templateUrl: './mail-controls.component.html',
    styleUrls: ['./mail-controls.component.scss']
})
export class MailControlsComponent implements OnInit {
    constructor(
        private readonly socialService: SocialService,
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly mailService: MailService,
        private readonly route: ActivatedRoute,
        private readonly router: Router
    ) {}

    auth2!: any
    authedUser!: any

    ngOnInit(): void {
        if (this.route.snapshot.queryParamMap.has('code')) {
            this.mailService
                .setCredentials(this.route.snapshot.queryParamMap.get('code') as string)
                .subscribe({
                    next: (response: { tokens: any; profile: any }) => {
                        this.router.navigate([], {
                            queryParams: {
                                code: null,
                                connectMail: null
                            },
                            queryParamsHandling: 'merge'
                        })

                        this.data = {
                            token: {
                                access: response.tokens.access_token,
                                refresh: response.tokens.refresh_token,
                                expiresAt: moment(response.tokens.expiry_date).toDate()
                            },
                            email: response.profile.email,
                            avatar: {
                                url: response.profile.picture
                            },
                            service: {
                                name: 'gmail'
                            }
                        }

                        this.close()
                    }
                })
        }
    }

    stage: any = {
        isSelectedService: false
    }

    data: any = {}

    selectService(service: string) {
        switch (service) {
            case 'google': {
                this.socialService.signInWith(service)
                break
            }
        }
    }

    close() {
        this.ref.close({
            data: this.data
        })
    }
}
