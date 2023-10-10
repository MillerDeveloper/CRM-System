import { SelectButtonModule } from 'primeng/selectbutton'
import { ButtonModule } from 'primeng/button'
import { InputTextModule } from 'primeng/inputtext'
import { ReactiveFormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BinotelControlsComponent } from './binotel-controls.component'

@NgModule({
    declarations: [BinotelControlsComponent],
    imports: [
        CommonModule,
        DropdownModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        SelectButtonModule
    ],
    exports: [BinotelControlsComponent]
})
export class BinotelControlsModule {}
