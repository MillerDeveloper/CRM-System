import {TranslateModule} from '@ngx-translate/core'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { SiteControlsComponent } from './site-controls.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SelectButtonModule } from 'primeng/selectbutton'
import { ListboxModule } from 'primeng/listbox'
import { SliderModule } from 'primeng/slider'
import { MultiSelectModule } from 'primeng/multiselect'

@NgModule({
    declarations: [SiteControlsComponent],
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        SelectButtonModule,
        ListboxModule,
        FormsModule,
        SliderModule,
        MultiSelectModule,
        DropdownModule,
        TranslateModule
    ],
    exports: [SiteControlsComponent]
})
export class SiteControlsModule {}
