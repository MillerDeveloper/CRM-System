import { TranslateModule } from '@ngx-translate/core'
import { CallsModule } from './../calls/calls.module'
import { DeliveriesModule } from './../deliveries/deliveries.module'
import { ChatsModule } from './../chats/chats.module'
import { FilesModule } from './../files/files.module'
import { TasksModule } from './../tasks/tasks.module'
import { ButtonModule } from 'primeng/button'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { FormsModule } from '@angular/forms'
import { SharedModule, ConfirmationService } from 'primeng/api'
import { FieldsetModule } from 'primeng/fieldset'
import { DividerModule } from 'primeng/divider'
import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'

import { ElementCardRoutingModule } from './element-card-routing.module'
import { ElementCardComponent } from './element-card.component'
import { SplitButtonModule } from 'primeng/splitbutton'
import { HeaderComponent } from './header/header.component'
import { ToolbarComponent } from './toolbar/toolbar.component'
import { AvatarModule } from 'primeng/avatar'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { TabViewModule } from 'primeng/tabview'
import { TimelineModule } from 'primeng/timeline'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { DialogService } from 'primeng/dynamicdialog'
import { PickListModule } from 'primeng/picklist'
import { SelectButtonModule } from 'primeng/selectbutton'
import { ConnectElementFieldsComponent } from '@/shared/components/dialogs/connect-element-fields/connect-element-fields.component'
import { PanelModule } from 'primeng/panel'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { TableViewModule } from '@/shared/components/table-view/table-view.module'
import { FieldValueModule } from '@/shared/pipes/field-value/field-value.module'
import { ElementFieldsModule } from '@/shared/components/element-fields/element-fields.module'
import { BadgeModule } from 'primeng/badge'
import { ConnectToElementModule } from '@/shared/components/dialogs/connect-to-element/connect-to-element.module'

@NgModule({
    declarations: [
        ElementCardComponent,
        HeaderComponent,
        ToolbarComponent,
        ConnectElementFieldsComponent
    ],
    imports: [
        CommonModule,
        ElementCardRoutingModule,
        SplitButtonModule,
        AvatarModule,
        AvatarGroupModule,
        TabViewModule,
        DividerModule,
        FieldsetModule,
        ElementFieldsModule,
        SharedModule,
        TimelineModule,
        ConfirmDialogModule,
        PickListModule,
        SelectButtonModule,
        FormsModule,
        PanelModule,
        FieldValueModule,
        TableViewModule,
        OverlayPanelModule,
        InputTextareaModule,
        BadgeModule,
        ButtonModule,
        TasksModule,
        FilesModule,
        ChatsModule,
        DeliveriesModule,
        CallsModule,
        TranslateModule,
        ConnectToElementModule
    ],
    providers: [ConfirmationService, DialogService, DatePipe]
})
export class ElementCardModule {}
