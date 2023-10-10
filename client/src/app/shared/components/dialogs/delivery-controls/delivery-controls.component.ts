import { Component, OnInit, Input } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-delivery-controls',
    templateUrl: './delivery-controls.component.html',
    styleUrls: ['./delivery-controls.component.scss']
})
export class DeliveryControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    serviceType!: string
    ngOnInit(): void {
        if (this.config.data) {
            this.serviceType = this.config.data.serviceType
        }
    }

    createDelivery(deliveryData: any) {
        this.ref.close({ data: deliveryData, service: this.serviceType })
    }
}
