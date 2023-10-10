import {TranslateModule} from '@ngx-translate/core'
import { DropdownModule } from 'primeng/dropdown'
import { DividerModule } from 'primeng/divider'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SitesRoutingModule } from './sites-routing.module'
import { SitesComponent } from './sites.component'
import { SiteControlsModule } from '../../dialogs/settings/site-controls/site-controls.module'

@NgModule({
    declarations: [SitesComponent],
    imports: [
        CommonModule,
        SitesRoutingModule,
        ButtonModule,
        SiteControlsModule,
        DividerModule,
        DropdownModule,
        TranslateModule
    ]
})
export class SitesModule {}
