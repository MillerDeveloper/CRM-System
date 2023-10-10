import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UserRightsComponent } from './user-rights.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { DividerModule } from 'primeng/divider'
import { InputTextModule } from 'primeng/inputtext'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { SelectButtonModule } from 'primeng/selectbutton'
import { TableModule } from 'primeng/table'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
    declarations: [UserRightsComponent],
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
        TranslateModule
    ],
    exports: [UserRightsComponent]
})
export class UserRightsModule {}
