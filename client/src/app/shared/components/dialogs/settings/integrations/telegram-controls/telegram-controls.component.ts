import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'
import { UserService } from '@/shared/services/user/user.service'

@Component({
    selector: 'app-telegram-controls',
    templateUrl: './telegram-controls.component.html',
    styleUrls: ['./telegram-controls.component.scss']
})
export class TelegramControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly userService: UserService
    ) {}

    telegramForm: FormGroup = new FormGroup({
        key: new FormControl(null, [Validators.required]),
        welcomeMessage: new FormControl(null),
        distribution: new FormGroup({
            method: new FormControl('queue'),
            users: new FormControl([])
        })
    })
    filterValue: string = ''
    stage: any = {
        isFilledInfoFields: false
    }
    methods: any[] = [
        {
            name: 'Random',
            value: 'random'
        },
        {
            name: 'Queue',
            value: 'queue'
        }
    ]
    data: any = {
        users: []
    }

    ngOnInit(): void {
        if (this.config.data) {
            if (this.config.data.info) {
                this.telegramForm.patchValue(this.config.data.info)
            }

            this.data.users = this.userService.users.map((user: any) => {
                return {
                    coefficient: 100,
                    data: user
                }
            })
        }
    }

    nextStep() {
        if (!this.stage.isFilledInfoFields) {
            this.stage.isFilledInfoFields = true
        } else if (this.stage.isFilledInfoFields) {
            this.close()
        }
    }

    close() {
        this.ref.close({
            data: this.telegramForm.value
        })
    }
}
