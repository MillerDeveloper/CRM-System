import { TranslateModule } from '@ngx-translate/core'
import { FieldsetModule } from 'primeng/fieldset'
import { DividerModule } from 'primeng/divider'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SettingsSidebarComponent } from './settings-sidebar.component'

@NgModule({
    declarations: [SettingsSidebarComponent],
    imports: [CommonModule, RouterModule, DividerModule, FieldsetModule, TranslateModule],
    exports: [SettingsSidebarComponent]
})
export class SettingsSidebarModule {}
