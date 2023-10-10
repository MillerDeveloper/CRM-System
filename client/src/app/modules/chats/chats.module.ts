import { TranslateModule } from '@ngx-translate/core'
import { ReactiveFormsModule } from '@angular/forms'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ChatsRoutingModule } from './chats-routing.module'
import { ChatsComponent } from './chats.component'
import { AvatarModule } from 'primeng/avatar'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { ChatControlsModule } from '@/shared/components/dialogs/chat-controls/chat-controls.module'
import { MessageComponent } from './message/message.component'
import { ChipModule } from 'primeng/chip'

@NgModule({
    declarations: [ChatsComponent, MessageComponent],
    imports: [
        CommonModule,
        ChatsRoutingModule,
        DividerModule,
        AvatarModule,
        AvatarGroupModule,
        ButtonModule,
        ChatControlsModule,
        InputTextareaModule,
        ReactiveFormsModule,
        TranslateModule,
        ChipModule
    ],
    exports: [ChatsComponent]
})
export class ChatsModule {}
