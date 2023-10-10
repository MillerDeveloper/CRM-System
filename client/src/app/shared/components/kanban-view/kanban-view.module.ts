import { TranslateModule } from '@ngx-translate/core'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { InputTextModule } from 'primeng/inputtext'
import { DividerModule } from 'primeng/divider'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { KanbanViewComponent } from './kanban-view.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ColorPickerModule } from 'primeng/colorpicker'
import { BadgeModule } from 'primeng/badge'
import { CheckboxModule } from 'primeng/checkbox'
import { InplaceModule } from 'primeng/inplace'
import { DragDropModule } from 'primeng/dragdrop'
import { MenuModule } from 'primeng/menu'
import { PaginatorModule } from 'primeng/paginator'
import { ElementFieldsModule } from '../element-fields/element-fields.module'
import { ProgressSpinnerModule } from 'primeng/progressspinner'

@NgModule({
    declarations: [KanbanViewComponent],
    imports: [
        CommonModule,
        ButtonModule,
        ColorPickerModule,
        FormsModule,
        BadgeModule,
        DividerModule,
        CheckboxModule,
        InplaceModule,
        InputTextModule,
        DragDropModule,
        OverlayPanelModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule,
        MenuModule,
        PaginatorModule,
        ElementFieldsModule,
        ProgressSpinnerModule
    ],
    exports: [KanbanViewComponent]
})
export class KanbanViewModule {}
