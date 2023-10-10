import { UserService } from '@/shared/services/user/user.service'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
    selector: 'app-users-multiselect',
    templateUrl: './users-multiselect.component.html',
    styleUrls: ['./users-multiselect.component.scss']
})
export class UsersMultiselectComponent implements OnInit {
    @Input() config!: { selectedUsers: any[]; selectWithoutCurrent?: boolean; }
    @Input() formConfig!: { form: FormGroup; controlName: string }
    @Output() selectionChanged: EventEmitter<any> = new EventEmitter()

    constructor(public readonly userService: UserService) {}

    users: any[] = []

    ngOnInit(): void {
        if (this.config?.selectWithoutCurrent) {
            this.users = this.userService.usersWithoutCurrent
        } else {
            this.users = this.userService.users
        }
    }

    onSelectionChanged(event: { value: any }) {
        this.config.selectedUsers = event.value
        this.selectionChanged.emit(event.value)
    }
}
