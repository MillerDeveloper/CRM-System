import {AutoFocusModule} from 'primeng/autofocus'
import { TabViewModule } from 'primeng/tabview'
import { CheckboxModule } from 'primeng/checkbox'
import { AddFieldOverlayModule } from './../../shared/components/widgets/add-field-overlay/add-field-overlay.module'
import { TranslateModule } from '@ngx-translate/core'
import { TooltipModule } from 'primeng/tooltip'
import { FieldControlsModule } from './../../shared/components/dialogs/field-controls/field-controls.module'
import { DividerModule } from 'primeng/divider'
import { InputTextModule } from 'primeng/inputtext'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { CollectionComponent } from './collection.component'
import { CollectionHeaderModule } from '@/shared/components/collection-header/collection-header.module'
import { ToolbarComponent } from './toolbar/toolbar.component'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { MenuModule } from 'primeng/menu'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TableViewModule } from '@/shared/components/table-view/table-view.module'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { CreateViewOptionComponent } from '@/shared/components/dialogs/create-view-option/create-view-option.component'
import { SplitButtonModule } from 'primeng/splitbutton'
import { OrderListModule } from 'primeng/orderlist'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { InitialElementFieldsComponent } from '@/shared/components/dialogs/initial-element-fields/initial-element-fields.component'
import { PickListModule } from 'primeng/picklist'
import { ElementFieldsModule } from '@/shared/components/element-fields/element-fields.module'
import { InputSwitchModule } from 'primeng/inputswitch'
import { CreateCollectionElementComponent } from '@/shared/components/dialogs/create-collection-element/create-collection-element.component'
import { KanbanViewModule } from '@/shared/components/kanban-view/kanban-view.module'
import { ImportElementsModule } from '@/shared/components/dialogs/import-elements/import-elements.module'
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { MigrateElementsComponent } from '@/shared/components/dialogs/migrate-elements/migrate-elements.component'

@NgModule({
    declarations: [
        CollectionComponent,
        ToolbarComponent,
        CreateCollectionElementComponent,
        CreateViewOptionComponent,
        InitialElementFieldsComponent,
        MigrateElementsComponent
    ],
    imports: [
        CommonModule,
        CollectionHeaderModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        MenuModule,
        SelectButtonModule,
        FormsModule,
        TableViewModule,
        OverlayPanelModule,
        DividerModule,
        KanbanViewModule,
        ReactiveFormsModule,
        InputTextareaModule,
        SplitButtonModule,
        OrderListModule,
        ConfirmDialogModule,
        PickListModule,
        ElementFieldsModule,
        InputSwitchModule,
        FieldControlsModule,
        TooltipModule,
        ImportElementsModule,
        PickerModule,
        TranslateModule,
        AddFieldOverlayModule,
        ProgressSpinnerModule,
        CheckboxModule,
        TabViewModule,
        AutoFocusModule
    ]
})
export class CollectionModule {}
