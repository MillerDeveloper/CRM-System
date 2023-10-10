import {SliderModule} from 'primeng/slider'
import {ListboxModule} from 'primeng/listbox'
import {SelectButtonModule} from 'primeng/selectbutton'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TelegramControlsComponent } from './telegram-controls.component'
import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'

@NgModule({
    declarations: [TelegramControlsComponent],
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        SelectButtonModule,
        ListboxModule,
        FormsModule,
        SliderModule
    ],
    exports: [TelegramControlsComponent]
})
export class TelegramControlsModule {}
