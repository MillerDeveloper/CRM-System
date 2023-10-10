import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { getFieldValue } from '@globalShared/utils/system.utils'
import { OverlayPanel } from 'primeng/overlaypanel'
import { ICustomFieldConfig } from '../../element-fields.component'

@Component({
    selector: 'app-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
    @Input() config!: ICustomFieldConfig
    @ViewChild('op') opRef!: OverlayPanel
    @Output() setValue: EventEmitter<any> = new EventEmitter()

    constructor(public readonly collectionElementService: CollectionElementService) {}
    elementPrice: number = 0
    elementQuantity: number = 0

    ngOnInit(): void {
        if (this.config?.element) {
            this.elementPrice = getFieldValue(this.config.element, 'price')
            this.elementQuantity = getFieldValue(this.config.element, 'quantity')
        } else {
            throw new Error('Element not passed')
        }
    }

    toggleOp(event: any) {
        event.stopImmediatePropagation()
        if (this.config.disabled) {
            return
        } else {
            this.opRef.toggle(event)
        }
    }

    getCurrency() {
        return this.collectionElementService.getElementCurrency(this.config.element)
    }

    calcDiscount(event: { value: number }) {
        const discount = Math.floor((this.elementPrice * event.value) / 100)
        this.config.fieldForm.patchValue({
            fieldValue: discount
        })
    }

    closeOp(event: any) {
        this.setValue.emit()
        this.opRef.toggle(event)
    }
}
