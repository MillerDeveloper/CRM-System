import { UserService } from '@/shared/services/user/user.service'
import { Component } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-invite-users',
    templateUrl: './invite-users.component.html',
    styleUrls: ['./invite-users.component.scss']
})
export class InviteUsersComponent {
    constructor(
        public readonly ref: DynamicDialogRef,
        private readonly userService: UserService,
        public readonly config: DynamicDialogConfig
    ) {}

    userEmails: string[] = []
    rights!: any
    stage: any = {
        isSettingRights: false,
        isFilledCollectionsRights: false
    }

    rightsChanged(event: { data: any }) {
        this.rights = event.data
    }

    invite() {
        this.userService
            .inviteUsers({
                emails: this.userEmails,
                rights: {
                    system: this.rights?.system || {},
                    collections: this.rights?.collections || {}
                }
            })
            .subscribe({
                next: (response: any) => {
                    this.ref.close()
                }
            })
    }

    nextStep() {
        if (!this.stage.isSettingRights) {
            this.stage.isSettingRights = true
        } else if (!this.stage.isFilledCollectionsRights) {
            this.stage.isFilledCollectionsRights = true
        } else if (this.stage.isFilledCollectionsRights) {
            this.invite()
        }
    }
}
