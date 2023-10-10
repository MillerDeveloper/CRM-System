import { DialogService } from 'primeng/dynamicdialog'
import { Component, OnInit } from '@angular/core'
import { InviteUsersComponent } from '../../dialogs/invite-users/invite-users.component'
import { UserService } from '@/shared/services/user/user.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-settings-sidebar',
    templateUrl: './settings-sidebar.component.html',
    styleUrls: ['./settings-sidebar.component.scss']
})
export class SettingsSidebarComponent implements OnInit {
    constructor(
        private readonly dialogService: DialogService,
        public readonly userService: UserService,
        private readonly translateService: TranslateService
    ) {}

    currentUser!: any

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser
    }

    onInviteUsers() {
        const dialogRef = this.dialogService.open(InviteUsersComponent, {
            header: this.translateService.instant('global.inviteMembers')
        })

        dialogRef.onClose.subscribe({
            next: () => {}
        })
    }
}
