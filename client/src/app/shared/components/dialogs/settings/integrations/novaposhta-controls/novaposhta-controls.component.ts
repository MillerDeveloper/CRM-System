import { NovaposhtaService } from '@/shared/services/deliveries/novaposha/novaposhta.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-novaposhta-controls',
    templateUrl: './novaposhta-controls.component.html',
    styleUrls: ['./novaposhta-controls.component.scss']
})
export class NovaposhtaControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly novaposhtaService: NovaposhtaService
    ) {}

    serviceData: any = {}
    stage: any = {
        isFilledApiKey: false
    }

    novaposhtaForm: FormGroup = new FormGroup({
        key: new FormControl(null, Validators.required),
        sender: new FormGroup({
            city: new FormControl(null),
            contact: new FormControl(null),
            warehouseType: new FormControl(null),
            data: new FormControl(null),
            address: new FormControl(null)
        })
    })

    ngOnInit(): void {
        if (this.config.data) {
            this.novaposhtaForm.patchValue(this.config.data.info)
            this.getWarehouseTypes()
        }
    }

    async getCities(event: { filter: string }) {
        const { response } = await this.novaposhtaService.getCities(event.filter)
        this.serviceData.cities = response[0].Addresses
    }

    async getCounterparty(property: string) {
        const { response }: any = await this.novaposhtaService.getCounterparty(property)
        this.serviceData.senders = response
    }

    nextStep() {
        if (!this.stage.isFilledApiKey) {
            this.stage.isFilledApiKey = true
        } else if (this.stage.isFilledApiKey) {
            this.close()
        }
    }

    async getContacts(property: string) {
        let ref: string = ''

        switch (property) {
            case 'Sender': {
                ref = this.novaposhtaForm.value.sender.data.Ref
                break
            }
            case 'Recipient': {
                ref = this.novaposhtaForm.value.resipient.data.Ref
                break
            }
        }

        const { response }: any = await this.novaposhtaService.getContacts({
            ref
        })

        this.serviceData.contactsSender = response
    }

    async getWarehouseTypes() {
        const { response } = await this.novaposhtaService.getWarehouseTypes()
        this.serviceData.warehouseTypes = response
    }

    async getWarehouses(event: { filter: string }, property: string) {
        let cityRef: string = ''
        let warehouseRef: string = ''

        cityRef = this.novaposhtaForm.value.sender.city.DeliveryCity
        warehouseRef = this.novaposhtaForm.value.sender.warehouseType.Ref

        const { response } = await this.novaposhtaService.getWarehouses({
            cityRef,
            warehouseRef,
            property,
            filter: event.filter
        })

        this.serviceData.warehouses = response
    }

    close() {
        this.ref.close({
            data: this.novaposhtaForm.value
        })
    }
}
