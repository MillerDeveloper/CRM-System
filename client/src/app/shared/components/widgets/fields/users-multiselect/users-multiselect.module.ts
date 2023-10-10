import { ReactiveFormsModule } from '@angular/forms'
import { AvatarModule } from 'primeng/avatar'
import { MultiSelectModule } from 'primeng/multiselect'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UsersMultiselectComponent } from './users-multiselect.component'
import { GetFirstLetterModule } from '@/shared/pipes/get-first-letter/get-first-letter.module'

@NgModule({
    declarations: [UsersMultiselectComponent],
    imports: [
        CommonModule,
        MultiSelectModule,
        AvatarModule,
        GetFirstLetterModule,
        ReactiveFormsModule
    ],
    exports: [UsersMultiselectComponent]
})
export class UsersMultiselectModule {}
