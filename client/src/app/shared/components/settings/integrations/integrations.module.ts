import {DividerModule} from 'primeng/divider'
import { NovaposhtaControlsModule } from './../../dialogs/settings/integrations/novaposhta-controls/novaposhta-controls.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { IntegrationsRoutingModule } from './integrations-routing.module'
import { IntegrationsComponent } from './integrations.component'
import { BinotelControlsModule } from '../../dialogs/settings/integrations/binotel-controls/binotel-controls.module'
import { TelegramControlsModule } from '../../dialogs/settings/integrations/telegram-controls/telegram-controls.module'

@NgModule({
    declarations: [IntegrationsComponent],
    imports: [
        CommonModule,
        IntegrationsRoutingModule,
        BinotelControlsModule,
        DividerModule,
        NovaposhtaControlsModule,
        TelegramControlsModule
    ]
})
export class IntegrationsModule {}
