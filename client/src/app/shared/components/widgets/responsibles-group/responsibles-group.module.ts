import { TooltipModule } from 'primeng/tooltip'
import { AvatarGroupModule } from 'primeng/avatargroup'
import { AvatarModule } from 'primeng/avatar'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ResponsiblesGroupComponent } from './responsibles-group.component'

@NgModule({
    declarations: [ResponsiblesGroupComponent],
    imports: [CommonModule, AvatarModule, AvatarGroupModule, TooltipModule],
    exports: [ResponsiblesGroupComponent]
})
export class ResponsiblesGroupModule {}
