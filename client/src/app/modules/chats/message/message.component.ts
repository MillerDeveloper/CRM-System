import { UserService } from '@/shared/services/user/user.service'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent {
    @Input() config!: { message: any }

    constructor(public readonly userService: UserService) {}

    isCurrentUserSent(): boolean {
        if (this.config?.message) {
            return this.config.message.createdBy?._id === this.userService.currentUser._id
        } else {
            return false
        }
    }
}
