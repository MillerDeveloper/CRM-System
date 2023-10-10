import {RouterModule} from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'

import { DefaultComponent } from './default.component'
import { SplitterModule } from 'primeng/splitter'
import { MainSidebarModule } from '@/shared/components/main-sidebar/main-sidebar.module'
import { TokenInterceptor } from '@/shared/interceptors/token/token.interceptor'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { DialogService } from 'primeng/dynamicdialog'
import { ContextMenuService } from 'primeng/api'

@NgModule({
    declarations: [DefaultComponent],
    imports: [CommonModule, SplitterModule, MainSidebarModule, RouterModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: TokenInterceptor
        },
        DialogService,
        ContextMenuService,
        DatePipe
    ]
})
export class DefaultModule {}
