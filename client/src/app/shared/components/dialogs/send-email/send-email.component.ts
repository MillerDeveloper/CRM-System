import { MailService } from '@/shared/services/mail/mail.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Component } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-send-email',
    templateUrl: './send-email.component.html',
    styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent {
    constructor(
        private readonly mailService: MailService,
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    emailForm: FormGroup = new FormGroup({
        sendTo: new FormControl([], [Validators.required, Validators.email]),
        subject: new FormControl(null, [Validators.required]),
        text: new FormControl(null, [Validators.required])
    })

    close() {
        this.mailService
            .sendEmail({
                ...this.emailForm.value,
                from: this.config.data.mail.email
            })
            .subscribe({
                next: () => {
                    this.ref.close()
                }
            })
    }
}
