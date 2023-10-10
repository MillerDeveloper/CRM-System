import { ElementFieldsModule } from '@/shared/components/element-fields/element-fields.module'
import { TranslateModule } from '@ngx-translate/core'
import { BadgeModule } from 'primeng/badge'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { MainSidebarComponent } from './main-sidebar.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AvatarModule } from 'primeng/avatar'
import { DividerModule } from 'primeng/divider'
import { InputTextModule } from 'primeng/inputtext'
import { RouterModule } from '@angular/router'
import { FieldsetModule } from 'primeng/fieldset'
import { DialogModule } from 'primeng/dialog'
import { DynamicDialogModule } from 'primeng/dynamicdialog'
import { CreateCollectionComponent } from '../dialogs/create-collection/create-collection.component'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { NotificationsOverlayModule } from '../widgets/notifications-overlay/notifications-overlay.module'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { PickerModule } from '@ctrl/ngx-emoji-mart'

@NgModule({
    declarations: [MainSidebarComponent, CreateCollectionComponent],
    imports: [
        CommonModule,
        AvatarModule,
        DividerModule,
        InputTextModule,
        RouterModule,
        FieldsetModule,
        DialogModule,
        ButtonModule,
        ReactiveFormsModule,
        DynamicDialogModule,
        InputTextareaModule,
        BadgeModule,
        OverlayPanelModule,
        NotificationsOverlayModule,
        PickerModule,
        TranslateModule,
        ElementFieldsModule
    ],
    exports: [MainSidebarComponent]
})
export class MainSidebarModule {}
