import {ButtonModule} from 'primeng/button'
import {UsersMultiselectModule} from './../../widgets/fields/users-multiselect/users-multiselect.module'
import { GetFirstLetterModule } from './../../../pipes/get-first-letter/get-first-letter.module'
import { AvatarModule } from 'primeng/avatar'
import { MultiSelectModule } from 'primeng/multiselect'
import { ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChatControlsComponent } from './chat-controls.component'

@NgModule({
    declarations: [ChatControlsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MultiSelectModule,
        AvatarModule,
        GetFirstLetterModule,
        UsersMultiselectModule,
        ButtonModule
    ],
    exports: [ChatControlsComponent]
})
export class ChatControlsModule {}
