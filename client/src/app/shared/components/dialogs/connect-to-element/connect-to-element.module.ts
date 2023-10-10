import { TranslateModule } from '@ngx-translate/core'
import { TableViewModule } from './../../table-view/table-view.module'
import { ButtonModule } from 'primeng/button'
import { ConnectToElementComponent } from './connect-to-element.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

@NgModule({
    declarations: [ConnectToElementComponent],
    imports: [CommonModule, TableViewModule, ButtonModule, TranslateModule],
    exports: [ConnectToElementComponent]
})
export class ConnectToElementModule {}
