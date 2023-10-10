import {UploadButtonModule} from './../../widgets/upload-button/upload-button.module'
import { FormsModule } from '@angular/forms'
import { DividerModule } from 'primeng/divider'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ImportElementsComponent } from './import-elements.component'
import { MultiSelectModule } from 'primeng/multiselect'

@NgModule({
    declarations: [ImportElementsComponent],
    imports: [
        CommonModule,
        ButtonModule,
        DropdownModule,
        DividerModule,
        FormsModule,
        MultiSelectModule,
        UploadButtonModule
    ],
    exports: [ImportElementsComponent]
})
export class ImportElementsModule {}
