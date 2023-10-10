import { getFieldValue } from '@globalShared/utils/system.utils'
import { NovaposhtaService } from './../../../../services/deliveries/novaposha/novaposhta.service'
import { UserService } from '@/shared/services/user/user.service'
import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'
import { OverlayPanel } from 'primeng/overlaypanel'
import { lastValueFrom } from 'rxjs'

@Component({
    selector: 'app-novaposhta',
    templateUrl: './novaposhta.component.html',
    styleUrls: ['./novaposhta.component.scss']
})
export class NovaposhtaComponent {
    @Input() config!: any
    @ViewChild('selectTaskDate', { static: false }) selectTaskDate!: OverlayPanel
    @Output() createDelivery: EventEmitter<any> = new EventEmitter()

    constructor(
        public readonly userService: UserService,
        private readonly novaposhtaService: NovaposhtaService
    ) { }

    stage: any = {
        addMoreDeliveries: false,
        isFilledSenderFields: false,
        isFilledRecipientFields: false
    }
    deliveryServiceData: any = {}
    serviceData: any = {}
    deliveryMenuModel: MenuItem[] = [
        {
            label: 'Create more',
            icon: 'pi pi-plus',
            command: () => {
                this.stage.addMoreDeliveries = true
            }
        }
    ]
    paymentMethods: any[] = [
        {
            controlName: 'Cash'
        },
        {
            controlName: 'NonCash'
        }
    ]
    payerTypes: any[] = [
        {
            controlName: 'Sender'
        },
        {
            controlName: 'Recipient'
        }
    ]
    serviceTypes: any[] = [
        {
            controlName: 'DoorsDoors'
        },
        {
            controlName: 'DoorsWarehouse'
        },
        {
            controlName: 'WarehouseWarehouse'
        },
        {
            controlName: 'WarehouseDoors'
        }
    ]

    deliveryForm: FormGroup = new FormGroup({
        _id: new FormControl(null),
        sender: new FormGroup({
            city: new FormControl(null),
            contact: new FormControl(null),
            warehouseType: new FormControl(null),
            data: new FormControl(null),
            address: new FormControl(null)
        }),
        recipient: new FormGroup({
            city: new FormControl(null),
            contact: new FormControl(null),
            warehouseType: new FormControl(null),
            data: new FormControl(null),
            address: new FormControl(null),
            phone: new FormControl(null),
            firstName: new FormControl(null),
            middleName: new FormControl(null),
            lastName: new FormControl(null)
        }),
        deliveryDate: new FormControl(null, Validators.required),
        //
        description: new FormControl(null),
        cost: new FormControl(null),
        cargoType: new FormControl(null),
        seatsAmount: new FormControl(null),
        serviceType: new FormControl(null),
        payerType: new FormControl(null),
        paymentMethod: new FormControl(null),
        weight: new FormControl(null),
        volumeGeneral: new FormControl(null)
    })
    modalMode!: string

    ngOnInit(): void { }

    nextStep() {
        if (!this.stage.isFilledSenderFields) {
            this.stage.isFilledSenderFields = true
            this.serviceData = {}
        } else if (!this.stage.isFilledRecipientFields) {
            this.stage.isFilledRecipientFields = true
        } else {
            this.onConnectToDelivery()
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

    async getContacts(property: string) {
        let ref: string = ''

        switch (property) {
            case 'Sender': {
                ref = this.deliveryForm.value.sender.data.Ref
                break
            }
            case 'Recipient': {
                ref = this.deliveryForm.value.recipient.data.Ref
                break
            }
        }

        const { response }: any = await this.novaposhtaService.getContacts({
            ref
        })

        this.serviceData.contactsSender = response
    }

    async getWarehouses(event: { filter: string }, property: string) {
        let cityRef: string = ''
        let warehouseRef: string = ''

        switch (property) {
            case 'Sender': {
                cityRef = this.deliveryForm.value.sender.city.DeliveryCity
                warehouseRef = this.deliveryForm.value.sender.warehouseType.Ref
                break
            }
            case 'Recipient': {
                cityRef = this.deliveryForm.value.recipient.city.DeliveryCity
                warehouseRef = this.deliveryForm.value.recipient.warehouseType.Ref
                break
            }
        }

        const { response } = await this.novaposhtaService.getWarehouses({
            cityRef,
            warehouseRef,
            property,
            filter: event.filter
        })

        this.serviceData.warehouses = response
    }

    async createCounterparty(property: string) {
        const element = this.config.data.element
        const name =
            this.deliveryForm.value.recipient.firstName ||
            getFieldValue(element, { _id: 'name' })
        const lastname =
            this.deliveryForm.value.recipient.middleName ||
            getFieldValue(element, { _id: 'lastname' })
        const patronymic =
            this.deliveryForm.value.recipient.lastName ||
            getFieldValue(element, { _id: 'patronymic' })

        const phone = getFieldValue(element, { _id: 'phone' })
        const email = getFieldValue(element, { _id: 'email' })

        const { response }: any = await this.novaposhtaService.saveCounterparty({
            property: property,
            elementData: {
                name,
                lastname,
                patronymic,
                phone,
                email
            }
        })

        this.deliveryForm.patchValue({
            recipient: {
                firstName: name,
                middleName: lastname,
                lastName: patronymic,
                data: response[0],
                contact: response[0]?.ContactPerson?.data[0]?.Ref,
                phone: phone
            }
        })
    }

    async getWarehouseTypes() {
        const { response } = await this.novaposhtaService.getWarehouseTypes()
        this.serviceData.warehouseTypes = response
    }

    async getCargoTypes() {
        const { response }: any = await this.novaposhtaService.getCargoTypes()
        this.serviceData.cargoTypes = response
    }

    close(data: any) {
        this.createDelivery.emit({
            cost: { amount: data.CostOnSite, currency: 'UAH' },
            deliveryAt: this.deliveryForm.value.deliveryDate,
            waybill: {
                tracker: data.IntDocNumber,
                service: 'novaposhta'
            }
        })
    }

    async onConnectToDelivery() {
        const { response } = await this.novaposhtaService.createDelivery(this.deliveryForm.value)
        this.close(response[0])
    }
}