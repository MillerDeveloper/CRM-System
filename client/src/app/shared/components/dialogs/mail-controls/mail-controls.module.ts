import { TranslateModule } from '@ngx-translate/core'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MailControlsComponent } from './mail-controls.component'

@NgModule({
    declarations: [MailControlsComponent],
    imports: [CommonModule, ButtonModule, TranslateModule],
    exports: [MailControlsComponent]
})
export class MailControlsModule {}
