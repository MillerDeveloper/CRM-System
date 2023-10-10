import { TranslateModule } from '@ngx-translate/core'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { TabViewModule } from 'primeng/tabview'
import { NotificationsOverlayComponent } from './notifications-overlay.component'

@NgModule({
    declarations: [NotificationsOverlayComponent],
    imports: [CommonModule, OverlayPanelModule, TabViewModule, ButtonModule, TranslateModule],
    exports: [NotificationsOverlayComponent]
})
export class NotificationsOverlayModule {}
