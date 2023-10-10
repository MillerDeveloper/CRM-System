import { ActivatedRoute } from '@angular/router'
import { MailControlsComponent } from '@/shared/components/dialogs/mail-controls/mail-controls.component'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { UserService } from '@/shared/services/user/user.service'
import { Component, OnInit } from '@angular/core'
import { DialogService } from 'primeng/dynamicdialog'
import { SendEmailComponent } from '@/shared/components/dialogs/send-email/send-email.component'

@Component({
    selector: 'app-mail',
    templateUrl: './mail.component.html',
    styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {
    constructor(
        private readonly dialogService: DialogService,
        private readonly userService: UserService,
        private readonly route: ActivatedRoute
    ) {}

    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }
    selectedMail!: any
    currentUser!: any
    filter: any = {}

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser

        if (this.currentUser) {
            this.selectedMail = this.currentUser.integrations.mail[0]

            this.route.queryParams.subscribe({
                next: (response: any) => {
                    if (response.connectMail) {
                        this.onConnectMail()
                    }
                }
            })
        }
    }

    onConnectMail() {
        const dialogRef = this.dialogService.open(MailControlsComponent, {
            header: 'Connect mail'
        })

        dialogRef.onClose.subscribe({
            next: (response: { data: any }) => {
                if (response) {
                    if (!this.currentUser.integrations) {
                        this.currentUser.integrations = {
                            mail: []
                        }
                    }

                    if (!Array.isArray(this.currentUser.integrations.mail)) {
                        this.currentUser.integrations.mail = []
                    }

                    const index = this.currentUser.integrations.mail.findIndex(
                        (mail: any) => mail.email === response.data.email
                    )

                    if (index !== -1) {
                        this.currentUser.integrations.mail[index] = response.data
                    } else {
                        this.currentUser.integrations.mail.push(response.data)
                    }

                    this.userService.updateOne(this.currentUser).subscribe({
                        next: () => {}
                    })
                }
            }
        })
    }

    onSendMail() {
        const dialogRef = this.dialogService.open(SendEmailComponent, {
            header: 'Send Email',
            data: {
                mail: this.selectedMail
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: any) => {}
        })
    }

    onSelectMail(event: { value: any }) {
        this.loadingConfig.isLoadingData = true
        this.selectedMail = event.value

        setTimeout(() => (this.loadingConfig.isLoadingData = false), 200)
    }
}
