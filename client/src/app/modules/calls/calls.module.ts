import {TranslateModule} from '@ngx-translate/core'
import { FetchFileModule } from './../../shared/pipes/fetch-file/fetch-file.module'
import { SharedModule } from 'primeng/api'
import { ButtonModule } from 'primeng/button'
import { ChipModule } from 'primeng/chip'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { CallsRoutingModule } from './calls-routing.module'
import { CallsComponent } from './calls.component'
import { HeaderComponent } from './header/header.component'
import { InplaceModule } from 'primeng/inplace'

@NgModule({
    declarations: [CallsComponent, HeaderComponent],
    imports: [
        CommonModule,
        CallsRoutingModule,
        ChipModule,
        ButtonModule,
        InplaceModule,
        SharedModule,
        FetchFileModule,
        TranslateModule
    ],
    exports: [CallsComponent]
})
export class CallsModule {}
