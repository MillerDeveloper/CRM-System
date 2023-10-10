import {InputTextareaModule} from 'primeng/inputtextarea'
import {PanelModule} from 'primeng/panel'
import {FieldsetModule} from 'primeng/fieldset'
import {DividerModule} from 'primeng/divider'
import {DropdownModule} from 'primeng/dropdown'
import {InputTextModule} from 'primeng/inputtext'
import {CalendarModule} from 'primeng/calendar'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { SplitButtonModule } from 'primeng/splitbutton'
import { ButtonModule } from 'primeng/button'
import { ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DeliveryControlsComponent } from './delivery-controls.component';
import { NovaposhtaComponent } from './novaposhta/novaposhta.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
    declarations: [DeliveryControlsComponent, NovaposhtaComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        SplitButtonModule,
        OverlayPanelModule,
        CalendarModule,
        InputTextModule,
        DropdownModule,
        DividerModule,
        FieldsetModule,
        PanelModule,
        InputTextareaModule,
        TranslateModule
    ],
    exports: [DeliveryControlsComponent]
})
export class DeliveryControlsModule {}
