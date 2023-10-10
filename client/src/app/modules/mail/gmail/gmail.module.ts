import { FormsModule } from '@angular/forms'
import { MultiSelectModule } from 'primeng/multiselect'
import { DropdownModule } from 'primeng/dropdown'
import { TranslateModule } from '@ngx-translate/core'
import { SidebarModule } from 'primeng/sidebar'
import { ChipModule } from 'primeng/chip'
import { InputTextModule } from 'primeng/inputtext'
import { AvatarModule } from 'primeng/avatar'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GmailComponent } from './gmail.component'
import { ToolbarComponent } from './toolbar/toolbar.component'
import { ProgressBarModule } from 'primeng/progressbar'
import { ButtonModule } from 'primeng/button'
import { ChipsModule } from 'primeng/chips'
import { ToastModule } from 'primeng/toast'

@NgModule({
    declarations: [GmailComponent, ToolbarComponent],
    imports: [
        CommonModule,
        AvatarModule,
        InputTextModule,
        ProgressBarModule,
        ChipModule,
        SidebarModule,
        TranslateModule,
        DropdownModule,
        ButtonModule,
        MultiSelectModule,
        FormsModule,
        ChipsModule,
        ToastModule
    ],
    exports: [GmailComponent, ToolbarComponent]
})
export class GmailModule {}
