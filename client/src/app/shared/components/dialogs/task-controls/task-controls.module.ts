import {TranslateModule} from '@ngx-translate/core'
import {GetFirstLetterModule} from './../../../pipes/get-first-letter/get-first-letter.module'
import {AvatarModule} from 'primeng/avatar'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TaskControlsComponent } from './task-controls.component'
import { ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { SplitButtonModule } from 'primeng/splitbutton'
import { CalendarModule } from 'primeng/calendar'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { MultiSelectModule } from 'primeng/multiselect'
import { UsersMultiselectModule } from '../../widgets/fields/users-multiselect/users-multiselect.module'

@NgModule({
    declarations: [TaskControlsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        SplitButtonModule,
        OverlayPanelModule,
        CalendarModule,
        MultiSelectModule,
        AvatarModule,
        GetFirstLetterModule,
        TranslateModule,
        UsersMultiselectModule
    ],
    exports: [TaskControlsComponent]
})
export class TaskControlsModule {}
