import { TranslateModule } from '@ngx-translate/core'
import { ButtonModule } from 'primeng/button'
import { DividerModule } from 'primeng/divider'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AddFieldOverlayComponent } from './add-field-overlay.component'

@NgModule({
    declarations: [AddFieldOverlayComponent],
    imports: [CommonModule, DividerModule, ButtonModule, TranslateModule],
    exports: [AddFieldOverlayComponent]
})
export class AddFieldOverlayModule {}
