import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SettingsComponent } from './settings.component'
import { SettingsSidebarModule } from '@/shared/components/settings/settings-sidebar/settings-sidebar.module'
import { TokenInterceptor } from '@/shared/interceptors/token/token.interceptor'
import { HTTP_INTERCEPTORS } from '@angular/common/http'

@NgModule({
    declarations: [SettingsComponent],
    imports: [CommonModule, SettingsSidebarModule, RouterModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: TokenInterceptor
        }
    ]
})
export class SettingsModule {}
