import { FormsModule } from '@angular/forms'
import { DividerModule } from 'primeng/divider'
import { AvatarModule } from 'primeng/avatar'
import { ChipModule } from 'primeng/chip'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { MailRoutingModule } from './mail-routing.module'
import { MailComponent } from './mail.component'
import { GmailComponent } from './gmail/gmail.component'
import { HeaderComponent } from './header/header.component'
import { TranslateModule } from '@ngx-translate/core'
import { MailControlsModule } from '@/shared/components/dialogs/mail-controls/mail-controls.module'
import { SidebarModule } from 'primeng/sidebar'
import { ProgressBarModule } from 'primeng/progressbar'
import { SendEmailModule } from '@/shared/components/dialogs/send-email/send-email.module';
import { ToolbarComponent } from './gmail/toolbar/toolbar.component'
import { GmailModule } from './gmail/gmail.module'

@NgModule({
    declarations: [MailComponent, HeaderComponent],
    imports: [
        CommonModule,
        MailRoutingModule,
        TranslateModule,
        ButtonModule,
        MailControlsModule,
        DropdownModule,
        ChipModule,
        AvatarModule,
        ProgressBarModule,
        SidebarModule,
        DividerModule,
        FormsModule,
        SendEmailModule,
        GmailModule
    ]
})
export class MailModule {}
