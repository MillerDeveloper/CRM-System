import { ChipModule } from 'primeng/chip'
import { DividerModule } from 'primeng/divider'
import { AvatarModule } from 'primeng/avatar'
import { BadgeModule } from 'primeng/badge'
import { TranslateModule } from '@ngx-translate/core'
import { ButtonModule } from 'primeng/button'
import { OverlayPanelModule } from 'primeng/overlaypanel'
import { DropdownModule } from 'primeng/dropdown'
import { MultiSelectModule } from 'primeng/multiselect'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext'
import { InplaceModule } from 'primeng/inplace'
import { NgModule } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { ElementFieldsComponent } from './element-fields.component'
import { SharedModule } from 'primeng/api'
import { AutoFocusModule } from 'primeng/autofocus'
import { FieldValueModule } from '@/shared/pipes/field-value/field-value.module'
import { CalendarModule } from 'primeng/calendar'
import { ProgressBarModule } from 'primeng/progressbar'
import { StageComponent } from './custom-fields/stage/stage.component'
import { ConnectionsComponent } from './custom-fields/connections/connections.component'
import { InputTextareaModule } from 'primeng/inputtextarea'
import { CheckboxModule } from 'primeng/checkbox'
import { RatingModule } from 'primeng/rating'
import { InputNumberModule } from 'primeng/inputnumber'
import { DiscountComponent } from './custom-fields/discount/discount.component'
import { AutoCompleteModule } from 'primeng/autocomplete'
import { ChipsModule } from 'primeng/chips'
import { SliderModule } from 'primeng/slider'
import { PhoneComponent } from './custom-fields/phone/phone.component'
import { KeyFilterModule } from 'primeng/keyfilter'

@NgModule({
    declarations: [
        ElementFieldsComponent,
        StageComponent,
        ConnectionsComponent,
        DiscountComponent,
        PhoneComponent
    ],
    imports: [
        CommonModule,
        InplaceModule,
        InputTextModule,
        FieldValueModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        AutoFocusModule,
        MultiSelectModule,
        DropdownModule,
        CalendarModule,
        ProgressBarModule,
        OverlayPanelModule,
        ButtonModule,
        InputTextareaModule,
        CheckboxModule,
        TranslateModule,
        RatingModule,
        BadgeModule,
        AvatarModule,
        DividerModule,
        InputNumberModule,
        ChipModule,
        AutoCompleteModule,
        ChipsModule,
        SliderModule,
        KeyFilterModule
    ],
    exports: [ElementFieldsComponent],
    providers: [DatePipe]
})
export class ElementFieldsModule {}
