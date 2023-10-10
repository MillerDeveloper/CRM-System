import { TranslateModule } from '@ngx-translate/core'
import { MultiSelectModule } from 'primeng/multiselect'
import { AddFieldOverlayModule } from './../widgets/add-field-overlay/add-field-overlay.module'
import { DividerModule } from 'primeng/divider'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableViewComponent } from './table-view.component'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { MenuModule } from 'primeng/menu'
import { SelectButtonModule } from 'primeng/selectbutton'
import { FormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { ContextMenuModule } from 'primeng/contextmenu'
import { FieldValueModule } from '@/shared/pipes/field-value/field-value.module'
import { ElementFieldsModule } from '../element-fields/element-fields.module'
import { ContextMenuService } from 'primeng/api'
import { SkeletonModule } from 'primeng/skeleton'

@NgModule({
    declarations: [TableViewComponent],
    imports: [
        CommonModule,
        DropdownModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        MenuModule,
        SelectButtonModule,
        FormsModule,
        ContextMenuModule,
        OverlayPanelModule,
        DividerModule,
        FieldValueModule,
        ElementFieldsModule,
        AddFieldOverlayModule,
        MultiSelectModule,
        TranslateModule,
        SkeletonModule
    ],
    providers: [ContextMenuService],
    exports: [TableViewComponent]
})
export class TableViewModule {}
