import { InputTextareaModule } from 'primeng/inputtextarea'
import { ReactiveFormsModule } from '@angular/forms'
import { TranslateModule } from '@ngx-translate/core'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SendEmailComponent } from './send-email.component'
import { InputTextModule } from 'primeng/inputtext'
import { ChipsModule } from 'primeng/chips'

@NgModule({
    declarations: [SendEmailComponent],
    imports: [
        CommonModule,
        ButtonModule,
        TranslateModule,
        ReactiveFormsModule,
        InputTextModule,
        InputTextareaModule,
        ChipsModule
    ],
    exports: [SendEmailComponent]
})
export class SendEmailModule {}
