import { lastValueFrom, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { getFieldValue } from '@globalShared/utils/system.utils'
import { DatePipe } from '@angular/common'

@Injectable({
    providedIn: 'root'
})
export class NovaposhtaService {
    constructor(private readonly httpClient: HttpClient, private readonly datePipe: DatePipe) {}

    getData(data: any) {
        try {
            return lastValueFrom(
                this.httpClient.post(`${environment.serverApiUrl}/integrations/novaposhta`, data)
            )
        } catch (error) {
            throw new Error('Server error')
        }
    }

    getCities(filter: string): Promise<any> {
        const data = {
            methodProperties: {
                CityName: filter,
                Limit: 50,
                Page: 1
            },
            calledMethod: 'searchSettlements',
            modelName: 'Address'
        }

        return this.getData(data)
    }

    async getCounterparty(property: string): Promise<any> {
        const data = {
            modelName: 'Counterparty',
            calledMethod: 'getCounterparties',
            methodProperties: {
                CounterpartyProperty: property,
                Page: '1'
            }
        }

        return this.getData(data)
    }

    async getWarehouses(config: any): Promise<any> {
        const data = {
            modelName: 'Address',
            calledMethod: 'getWarehouses',
            methodProperties: {
                FindByString: config.filter,
                CityRef: config.cityRef,
                Page: '1',
                Limit: '500',
                Language: 'UA',
                TypeOfWarehouseRef: config.warehouseRef
            }
        }

        return this.getData(data)
    }

    async getContacts(config: { ref: string }): Promise<any> {
        const data = {
            modelName: 'Counterparty',
            calledMethod: 'getCounterpartyContactPersons',
            methodProperties: {
                Ref: config.ref,
                Page: '1'
            }
        }

        return this.getData(data)
    }

    async getWarehouseTypes(): Promise<any> {
        const data = {
            modelName: 'Address',
            calledMethod: 'getWarehouseTypes',
            methodProperties: {}
        }

        return this.getData(data)
    }

    async saveCounterparty(config: { property: string; elementData: any }): Promise<any> {
        const data = {
            modelName: 'Counterparty',
            calledMethod: 'save',
            methodProperties: {
                FirstName: config.elementData.name,
                MiddleName: config.elementData.lastname,
                LastName: config.elementData.patronymic,
                Phone: config.elementData.phone,
                Email: config.elementData.email,
                CounterpartyType: 'PrivatePerson',
                CounterpartyProperty: config.property
            }
        }

        return this.getData(data)
    }

    async createDelivery(form: any): Promise<any> {
        const data = {
            modelName: 'InternetDocument',
            calledMethod: 'save',
            methodProperties: {
                DateTime: this.datePipe.transform(form.deliveryDate, 'dd.MM.yyyy'),
                ContactSender: form.sender.contact.Ref,
                CitySender: form.sender.city.Ref,
                SenderAddress: form.sender.address.Ref,
                Sender: form.sender.data.Ref,
                //
                ContactRecipient: form.recipient.contact,
                CityRecipient: form.recipient.city.Ref,
                RecipientAddress: form.recipient.address.Ref,
                Recipient: form.recipient.data.Ref,
                //
                Description: form.description,
                Cost: form.cost,
                SendersPhone: form.sender.contact.Phones,
                RecipientsPhone: form.recipient.phone,
                CargoType: form.cargoType,
                SeatsAmount: form.seatsAmount,
                ServiceType: form.serviceType,
                PayerType: form.payerType,
                PaymentMethod: form.paymentMethod ?? 'Cash',
                Weight: form.weight,
                VolumeGeneral: form.volumeGeneral
            }
        }

        return this.getData(data)
    }

    async getCargoTypes() {
        const data = {
            modelName: 'Common',
            calledMethod: 'getCargoTypes',
            methodProperties: {}
        }

        return this.getData(data)
    }
}
