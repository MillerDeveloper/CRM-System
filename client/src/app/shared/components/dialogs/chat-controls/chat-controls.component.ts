import { UserService } from '@/shared/services/user/user.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-chat-controls',
    templateUrl: './chat-controls.component.html',
    styleUrls: ['./chat-controls.component.scss']
})
export class ChatControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        public readonly userService: UserService
    ) {}

    chatForm!: FormGroup

    ngOnInit(): void {
        this.chatForm = new FormGroup({
            chatWith: new FormControl(null, [Validators.required]),
            chatType: new FormControl(null, [Validators.required]),
            mode: new FormControl(this.config.data?.mode ?? 'basic', [Validators.required])
        })
    }

    close() {
        const chatWith = this.chatForm.value.chatWith?.map((userId: string) => {
            return { data: userId }
        })

        this.chatForm.patchValue({
            chatWith,
            chatType: this.chatForm.value.chatWith.length === 1 ? 'single' : 'group'
        })

        this.ref.close({
            data: this.chatForm.value
        })
    }
}
