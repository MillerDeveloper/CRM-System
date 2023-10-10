import {TranslateModule} from '@ngx-translate/core'
import {RatingModule} from 'primeng/rating'
import {CheckboxModule} from 'primeng/checkbox'
import { AutoFocusModule } from 'primeng/autofocus'
import { DividerModule } from 'primeng/divider'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { MultiSelectModule } from 'primeng/multiselect'
import { FieldControlsComponent } from '@/shared/components/dialogs/field-controls/field-controls.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ColorPickerModule } from 'primeng/colorpicker'
import { ChipModule } from 'primeng/chip'
import { FieldsetModule } from 'primeng/fieldset'
import { RadioButtonModule } from 'primeng/radiobutton'

@NgModule({
    declarations: [FieldControlsComponent],
    imports: [
        CommonModule,
        MultiSelectModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        ReactiveFormsModule,
        FormsModule,
        ColorPickerModule,
        ChipModule,
        FieldsetModule,
        DividerModule,
        RadioButtonModule,
        AutoFocusModule,
        CheckboxModule,
        RatingModule,
        TranslateModule
    ],
    exports: [FieldControlsComponent]
})
export class FieldControlsModule {}
