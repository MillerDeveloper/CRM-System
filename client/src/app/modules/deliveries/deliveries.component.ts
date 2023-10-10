import { MenuItem } from 'primeng/api'
import { DeliveryControlsComponent } from '@/shared/components/dialogs/delivery-controls/delivery-controls.component'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { DeliveryService } from '@/shared/services/deliveries/delivery.service'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { DialogService } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-deliveries',
    templateUrl: './deliveries.component.html',
    styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
    @Input() config?: { isConnectedDeliveries: boolean; collection: any; element: any }
    @Output() deliveryCreated: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly dialogService: DialogService,
        private readonly deliveryService: DeliveryService,
        public readonly collectionElementService: CollectionElementService
    ) {}

    deliverySettingsMenu: MenuItem[] = [
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => this.deleteDelivery()
        }
    ]
    selectedDelivery!: any
    deliveries: any[] = []

    ngOnInit(): void {
        this.fetchDeliveries()
    }

    fetchDeliveries(): void {
        const filter: any = {}
        if (this.config?.isConnectedDeliveries) {
            filter['connection.to'] = this.config.element._id
        }

        this.deliveryService.findAll(filter).subscribe({
            next: (response: { deliveries: any[] }) => {
                this.deliveries = response.deliveries
            }
        })
    }

    openDeliveryControl(mode: string, data: any) {
        return this.dialogService.open(DeliveryControlsComponent, {
            header: mode === 'create' ? 'Create delivery' : 'Update delivery',
            data: data
        })
    }

    onCreateDelivery() {
        if (this.config?.element) {
            const dialogRef = this.openDeliveryControl('create', {
                serviceType: 'novaposhta',
                element: this.config.element,
                collection: this.config.collection
            })
            dialogRef.onClose.subscribe({
                next: (result: { data: any }) => {
                    if (result) {
                        const data = {
                            ...result.data,
                            connection: {
                                to: this.config?.element._id,
                                collectionRef: this.config?.collection._id,
                                model: 'CollectionElement'
                            }
                        }
                        this.deliveryService.create(data).subscribe({
                            next: (response: { delivery: any }) => {
                                this.deliveryCreated.emit(response.delivery)
                                this.fetchDeliveries()
                            }
                        })
                    }
                }
            })
        }
    }

    deleteDelivery() {
        this.deliveryService.deleteOne(this.selectedDelivery._id).subscribe({
            next: () => {
                this.fetchDeliveries()
            }
        })
    }
}
