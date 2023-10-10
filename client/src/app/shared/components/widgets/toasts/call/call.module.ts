import { SharedModule } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ToastModule } from 'primeng/toast'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CallComponent } from './call.component'

@NgModule({
    declarations: [CallComponent],
    imports: [CommonModule, ToastModule, ButtonModule, SharedModule],
    exports: [CallComponent]
})
export class CallModule {}
