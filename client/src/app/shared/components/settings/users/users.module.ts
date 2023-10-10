import {TranslateModule} from '@ngx-translate/core'
import {InviteUsersModule} from './../../dialogs/invite-users/invite-users.module'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UsersRoutingModule } from './users-routing.module'
import { UsersComponent } from './users.component'
import { TableModule } from 'primeng/table'
import { UserGroupControlModule } from '../../dialogs/settings/user-group-control/user-group-control.module'
import { MenuModule } from 'primeng/menu'
import { UserControlsModule } from '../../dialogs/settings/user-controls/user-controls.module'

@NgModule({
    declarations: [UsersComponent],
    imports: [
        CommonModule,
        UsersRoutingModule,
        TableModule,
        ButtonModule,
        UserGroupControlModule,
        MenuModule,
        UserControlsModule,
        InviteUsersModule,
        TranslateModule
    ]
})
export class UsersModule {}
