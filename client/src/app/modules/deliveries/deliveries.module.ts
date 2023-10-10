import {TranslateModule} from '@ngx-translate/core'
import { MenuModule } from 'primeng/menu'
import { ChipModule } from 'primeng/chip'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { DeliveriesRoutingModule } from './deliveries-routing.module'
import { DeliveriesComponent } from './deliveries.component'
import { HeaderComponent } from './header/header.component'
import { DeliveryControlsModule } from '@/shared/components/dialogs/delivery-controls/delivery-controls.module'

@NgModule({
    declarations: [DeliveriesComponent, HeaderComponent],
    imports: [
        CommonModule,
        DeliveriesRoutingModule,
        DeliveryControlsModule,
        ButtonModule,
        ChipModule,
        MenuModule,
        TranslateModule
    ],
    exports: [DeliveriesComponent]
})
export class DeliveriesModule {}
