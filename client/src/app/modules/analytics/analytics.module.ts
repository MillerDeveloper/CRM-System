import {TranslateModule} from '@ngx-translate/core'
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AnalyticsRoutingModule } from './analytics-routing.module'
import { AnalyticsComponent } from './analytics.component'
import { HeaderComponent } from './header/header.component'
import { TabViewModule } from 'primeng/tabview'
import { CardModule } from 'primeng/card'
import { ChartModule } from 'primeng/chart'
import { CalendarModule } from 'primeng/calendar'
import { SelectButtonModule } from 'primeng/selectbutton'

@NgModule({
    declarations: [AnalyticsComponent, HeaderComponent],
    imports: [
        CommonModule,
        AnalyticsRoutingModule,
        TabViewModule,
        CardModule,
        ChartModule,
        CalendarModule,
        FormsModule,
        SelectButtonModule,
        TranslateModule
    ]
})
export class AnalyticsModule {}
