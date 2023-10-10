import { TranslateModule } from '@ngx-translate/core'
import { UserRightsModule } from './../settings/user-rights/user-rights.module'
import { ButtonModule } from 'primeng/button'
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InviteUsersComponent } from './invite-users.component'
import { ChipsModule } from 'primeng/chips'

@NgModule({
    declarations: [InviteUsersComponent],
    imports: [
        CommonModule,
        ChipsModule,
        FormsModule,
        ButtonModule,
        UserRightsModule,
        TranslateModule
    ],
    exports: [InviteUsersComponent]
})
export class InviteUsersModule {}
