import { MultiSelectModule } from 'primeng/multiselect'
import { DropdownModule } from 'primeng/dropdown'
import { InputTextModule } from 'primeng/inputtext'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NovaposhtaControlsComponent } from './novaposhta-controls.component'

@NgModule({
    declarations: [NovaposhtaControlsComponent],
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        MultiSelectModule
    ],
    exports: [NovaposhtaControlsComponent]
})
export class NovaposhtaControlsModule {}
