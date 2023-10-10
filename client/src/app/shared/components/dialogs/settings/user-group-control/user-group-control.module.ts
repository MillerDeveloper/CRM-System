import {TranslateModule} from '@ngx-translate/core'
import { DividerModule } from 'primeng/divider'
import { TableModule } from 'primeng/table'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserGroupControlComponent } from './user-group-control.component'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { SelectButtonModule } from 'primeng/selectbutton'
import { UserRightsModule } from '../user-rights/user-rights.module'

@NgModule({
    declarations: [UserGroupControlComponent],
    imports: [
        CommonModule,
        ButtonModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        TableModule,
        CheckboxModule,
        SelectButtonModule,
        FormsModule,
        DividerModule,
        UserRightsModule,
        TranslateModule
    ],
    exports: [UserGroupControlComponent]
})
export class UserGroupControlModule {}
