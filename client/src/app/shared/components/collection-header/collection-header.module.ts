import { TranslateModule } from '@ngx-translate/core'
import { DividerModule } from 'primeng/divider'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CollectionRoutingModule } from '@/modules/collection/collection-routing.module'
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { SharedModule } from 'primeng/api'
import { AvatarModule } from 'primeng/avatar'
import { InplaceModule } from 'primeng/inplace'
import { InputTextModule } from 'primeng/inputtext'
import { CollectionHeaderComponent } from './collection-header.component'
import { MenuModule } from 'primeng/menu'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { TooltipModule } from 'primeng/tooltip'
import { FormsModule } from '@angular/forms'
import { AutoFocusModule } from 'primeng/autofocus'
import { InputTextareaModule } from 'primeng/inputtextarea'

@NgModule({
    declarations: [CollectionHeaderComponent],
    imports: [
        CommonModule,
        CollectionRoutingModule,
        PickerModule,
        AvatarModule,
        InplaceModule,
        SharedModule,
        InputTextModule,
        MenuModule,
        DividerModule,
        AvatarModule,
        AvatarGroupModule,
        TooltipModule,
        FormsModule,
        TranslateModule,
        AutoFocusModule,
        InputTextareaModule
    ],
    exports: [CollectionHeaderComponent]
})
export class CollectionHeaderModule {}
