import {FilesModule} from './../files/files.module'
import { TranslateModule } from '@ngx-translate/core'
import { ResponsiblesGroupModule } from './../../shared/components/widgets/responsibles-group/responsibles-group.module'
import { ElementFieldsModule } from '@/shared/components/element-fields/element-fields.module'
import { FieldValueModule } from './../../shared/pipes/field-value/field-value.module'
import { FieldsetModule } from 'primeng/fieldset'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { TasksRoutingModule } from './tasks-routing.module'
import { TasksComponent } from './tasks.component'
import { HeaderComponent } from './header/header.component'
import { RadioButtonModule } from 'primeng/radiobutton'
import { AvatarModule } from 'primeng/avatar'
import { ChipModule } from 'primeng/chip'
import { MenuModule } from 'primeng/menu'
import { PanelModule } from 'primeng/panel'
import { TaskControlsModule } from '@/shared/components/dialogs/task-controls/task-controls.module'
import { CheckboxModule } from 'primeng/checkbox'
import { UsersMultiselectModule } from '@/shared/components/widgets/fields/users-multiselect/users-multiselect.module'
import { SidebarModule } from 'primeng/sidebar'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { ChatsModule } from '../chats/chats.module'
import { ToggleButtonModule } from 'primeng/togglebutton'
import { CalendarModule } from 'primeng/calendar'
import { MultiSelectModule } from 'primeng/multiselect'
import { DropdownModule } from 'primeng/dropdown'
import { SelectButtonModule } from 'primeng/selectbutton'
import { TabViewModule } from 'primeng/tabview'
import { DividerModule } from 'primeng/divider'
import { SplitButtonModule } from 'primeng/splitbutton'
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ListViewComponent } from './list-view/list-view.component';
import { KanbanViewComponent } from './kanban-view/kanban-view.component'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@NgModule({
    declarations: [TasksComponent, HeaderComponent, ListViewComponent, KanbanViewComponent],
    imports: [
        CommonModule,
        TasksRoutingModule,
        ButtonModule,
        RadioButtonModule,
        AvatarGroupModule,
        AvatarModule,
        ChipModule,
        FormsModule,
        MenuModule,
        FieldsetModule,
        PanelModule,
        TaskControlsModule,
        FieldValueModule,
        CheckboxModule,
        ElementFieldsModule,
        ResponsiblesGroupModule,
        TranslateModule,
        UsersMultiselectModule,
        SidebarModule,
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        OverlayPanelModule,
        ChatsModule,
        ToggleButtonModule,
        ReactiveFormsModule,
        CalendarModule,
        MultiSelectModule,
        DropdownModule,
        SelectButtonModule,
        TabViewModule,
        FilesModule,
        DividerModule,
        SplitButtonModule,
        ConfirmDialogModule,
        ProgressSpinnerModule
    ],
    exports: [TasksComponent]
})
export class TasksModule {}
