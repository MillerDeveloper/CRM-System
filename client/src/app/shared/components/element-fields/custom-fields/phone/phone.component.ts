import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { getOnlyNumbers } from '@globalShared/utils/system.utils'
import { OverlayPanel } from 'primeng/overlaypanel'
import { ICustomFieldConfig } from '../../element-fields.component'

@Component({
    selector: 'app-phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit {
    @Input() config!: ICustomFieldConfig
    @ViewChild('op') opRef!: OverlayPanel

    phones: any[] = []

    ngOnInit(): void {
        if (this.config?.fieldForm) {
            this.phones = this.config.fieldForm.value.fieldValue || []
        } else {
            throw new Error('Field form is not defined')
        }
    }

    toggleOp(event: any) {
        if (this.config.disabled) {
            return
        } else {
            this.opRef.toggle(event)
        }
    }

    onPhoneChange(value: any, index: number) {
        this.phones[index] = getOnlyNumbers(value)
        this.config.fieldForm.patchValue({
            fieldValue: this.phones
        })
    }

    addPhone() {
        this.config.fieldForm.disable()
        this.phones.push('')
        this.config.fieldForm.patchValue({
            fieldValue: this.phones
        })
        this.config.fieldForm.enable()
    }

    removePhone(event: any, index: number) {
        event.stopPropagation()
        this.phones.splice(index, 1)
        this.config.fieldForm.patchValue({
            fieldValue: this.phones
        })
    }
}
