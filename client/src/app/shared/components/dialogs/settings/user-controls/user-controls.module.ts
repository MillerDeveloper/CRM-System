import { MultiSelectModule } from 'primeng/multiselect'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { TableModule } from 'primeng/table'
import { CheckboxModule } from 'primeng/checkbox'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserControlsComponent } from './user-controls.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { UserRightsModule } from '../user-rights/user-rights.module'
import { MenuModule } from 'primeng/menu'

@NgModule({
    declarations: [UserControlsComponent],
    imports: [
        CommonModule,
        CheckboxModule,
        TableModule,
        ReactiveFormsModule,
        FormsModule,
        SelectButtonModule,
        ButtonModule,
        MultiSelectModule,
        UserRightsModule,
        MenuModule
    ],
    exports: [UserControlsComponent]
})
export class UserControlsModule {}
