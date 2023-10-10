import { SystemService } from './../system/system.service'
import { NAME_FIELD } from './../../../../../../shared/constants/element.constants'
import { CollectionService } from './../collection/collection.service'
import { Observable } from 'rxjs'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import * as moment from 'moment'
import { DatePipe } from '@angular/common'
import { getFieldValue } from '@globalShared/utils/system.utils'
import { Router } from '@angular/router'
import { getCurrency, getUnit } from '@globalShared/utils/element.utils'

export const nameElementField = NAME_FIELD
const NOT_ALLOWED_SEARCH_FIELDS = ['responsibles', 'connections', 'updatedAt', 'createdAt', 'stage']

@Injectable({
    providedIn: 'root'
})
export class CollectionElementService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly collectionService: CollectionService,
        private readonly systemService: SystemService,
        private readonly router: Router,
        private readonly datePipe: DatePipe
    ) {}

    findMany(collectionId: string, fetchConfig: any = {}, query: any = {}): Observable<any> {
        return this.httpClient.get(
            `${
                environment.serverApiUrl
            }/collection-elements/${collectionId}?fetchConfig=${JSON.stringify(fetchConfig)}`,
            {
                params: new HttpParams({
                    fromObject: query
                })
            }
        )
    }

    findOne(collectionId: string, elementId: string): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/collection-elements/${collectionId}/${elementId}`
        )
    }

    findInAllCollections(filter: any, query: any, fetchConfig?: any): Observable<any> {
        return this.httpClient.get(
            `${
                environment.serverApiUrl
            }/collection-elements/findInAllCollections?filter=${JSON.stringify(
                filter
            )}&fetchConfig=${JSON.stringify(fetchConfig)}`,
            {
                params: new HttpParams({
                    fromObject: query
                })
            }
        )
    }

    create(config: { data: any }): Observable<any> {
        return this.httpClient.post(`${environment.serverApiUrl}/collection-elements`, config)
    }

    createMany(config: { data: any[] }): Observable<any> {
        return this.create(config)
    }

    update(data: any): Observable<any> {
        return this.httpClient.patch(`${environment.serverApiUrl}/collection-elements`, data)
    }

    deleteMany(ids: string[]): Observable<any> {
        return this.httpClient.delete(
            `${environment.serverApiUrl}/collection-elements/${ids.join('|')}`
        )
    }

    deleteOne(id: string): Observable<any> {
        return this.deleteMany([id])
    }

    migrateMany(ids: string[], to: string) {
        return this.httpClient.get(
            `${environment.serverApiUrl}/collection-elements/migrate/${ids.join('|')}/${to}`
        )
    }

    getConnectionFields(collection: any): any[] {
        if (collection?._id) {
            const collectionConfig = this.collectionService.getCollectionConfig(collection)

            return this.collectionService.getFields(
                collection.viewOptions,
                collectionConfig.viewOption._id,
                'connectionElement'
            )
        }

        return []
    }

    getGroupedFieldValue(field: any, value: any) {
        switch (field._id) {
            case 'responsibles': {
                return value
                    .map((vl: any) => {
                        return vl.name.full
                    })
                    .join(', ')
            }
            case 'phone': {
                return value.join(', ')
            }
            default: {
                const optionValue: string = field.optionValue

                if (typeof value === 'string' && field.fieldType.indexOf('date') === -1) {
                    return value
                } else if (Array.isArray(value)) {
                    value = value.reduce((acc: any[], option: any) => {
                        if (field.optionValue) {
                            if (optionValue.split('.').length === 1) {
                                acc.push(option[optionValue])
                            }
                        }

                        return acc
                    }, [])

                    return value.join(', ')
                } else {
                    if (value) {
                        if (optionValue) {
                            return value[optionValue]
                        }

                        switch (field.fieldType) {
                            case 'date':
                                return this.datePipe.transform(value, 'dd.MM.yyyy')
                            case 'datetime':
                                return this.datePipe.transform(value, 'dd.MM.yyyy HH:mm')
                            default: {
                                return value
                            }
                        }
                    }

                    return value
                }
            }
        }
    }

    getConnectionLabel(collection: any, element: any) {
        element = element?.data ? element.data : element

        if (!!element) {
            const nameField = getFieldValue(element, nameElementField)
            if (nameField) {
                return nameField
            } else {
                const connectionField = this.getConnectionFields(collection)[0]

                if (connectionField) {
                    return getFieldValue(element, connectionField)
                }
            }
        }
    }

    openCard(
        element: { connection: any },
        config?: { collectionRef?: string; elementId?: string; force?: boolean }
    ) {
        const collectionId = config?.collectionRef || element.connection.collectionRef._id
        const elementId = config?.elementId || element.connection.to._id
        const url = `/collection/${collectionId}/${elementId}`
        if (config?.force) {
            this.systemService.refreshComponent(url)
        } else {
            this.router.navigateByUrl(url)
        }
    }

    getElementsByConnectionId(collectionId: string, connections: any[]): any[] {
        if (Array.isArray(connections)) {
            const index = connections.findIndex(
                (connection: any) => connection.collectionRef?._id === collectionId
            )

            if (index !== -1) {
                return connections[index]?.elements || []
            } else {
                return []
            }
        } else {
            return []
        }
    }

    getSearchConfig(searchText: string, fields: any[], fetchConfig: any) {
        if (searchText.length > 1) {
            const searchData = {
                value: searchText,
                matchMode: 'contains',
                operator: 'or',
                isSearch: true
            }

            if (!fetchConfig.filter) {
                fetchConfig.filter = {}
            }

            fields.forEach((field: any) => {
                if (!NOT_ALLOWED_SEARCH_FIELDS.includes(field._id)) {

                    if (Array.isArray(fetchConfig.filter[field._id])) {
                        const index = fetchConfig.filter[field._id].findIndex(
                            (filter: any) => filter.isSearch
                        )

                        if (index !== -1) {
                            fetchConfig.filter[field._id][index] = searchData
                        } else if (
                            Array.isArray(fetchConfig.filter[field._id]) &&
                            fetchConfig.filter[field._id].length === 0
                        ) {
                            fetchConfig.filter[field._id].push(searchData)
                        }
                    } else {
                        fetchConfig.filter[field._id] = [searchData]
                    }
                }
            })
        } else {
            fields.forEach((field: any) => {
                if (fetchConfig.filter[field._id]) {
                    const index = fetchConfig.filter[field._id].findIndex(
                        (filter: any) => filter.isSearch
                    )

                    if (index !== -1) {
                        fetchConfig.filter[field._id].splice(index, 1)
                    }
                }
            })
        }

        fetchConfig.skip = 0
        return fetchConfig
    }

    getElementCurrency(element: any) {
        return getCurrency(element)
    }

    getElementUnit(element: any) {
        return getUnit(element)
    }
}
