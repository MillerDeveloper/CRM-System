import { IViewOption } from './../../../../../../shared/interfaces/collection.interface'
import {
    DEFAULT_FIELDS_FOR_LIVELY,
    DEFAULT_FIELDS_FOR_INANIMATE
} from '@globalShared/constants/element.constants'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Subject } from 'rxjs'
import { getElementFields } from '@globalShared/utils/collection.utils'
import { StorageService } from '../storage/storage.service'

@Injectable({
    providedIn: 'root'
})
export class CollectionService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly storageService: StorageService
    ) {}

    observer = new Subject()
    state: any = {
        config: {
            loadingConfig: {
                isFirstLoad: false,
                isLoadingConfig: false
            },
            selection: []
        }
    }
    public subscriber$: Observable<any> = this.observer.asObservable()

    findAll(filter: any): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/collections?filter=${JSON.stringify(filter)}`
        )
    }

    findOne(id: string): Observable<any> {
        return this.httpClient.get(`${environment.serverApiUrl}/collections/${id}`)
    }

    createCollection(data: any): Observable<any> {
        return this.httpClient.post(`${environment.serverApiUrl}/collections`, data)
    }

    update(data: any): Observable<any> {
        return this.httpClient.patch(`${environment.serverApiUrl}/collections`, data)
    }

    deleteMany(ids: string[]): Observable<any> {
        return this.httpClient.delete(`${environment.serverApiUrl}/collections/${ids.join('|')}`)
    }

    deleteOne(id: string): Observable<any> {
        return this.deleteMany([id])
    }

    getFields(
        viewOptions: any[],
        currentViewOptionId: string,
        fieldsType: string = 'basic'
    ): any[] {
        return getElementFields(viewOptions, currentViewOptionId, fieldsType)
    }

    setFields(viewOptions: any[], currentViewOptionId: string, fields: any[]) {
        const index = viewOptions.findIndex((option: any) => option._id === currentViewOptionId)

        if (index !== -1) {
            viewOptions[index].fields = fields
        }

        return viewOptions
    }

    getAllFields(viewOptions: any[]) {
        let fields: any[] = []
        viewOptions.forEach((option: any) => {
            fields = fields.concat(option.fields)
        })

        return fields
    }

    getCollectionConfig(collection: any): { viewOption: IViewOption } {
        const defaultValue = {
            viewOption: collection.viewOptions[0]
        }
        const config: any = this.storageService.getLsElement(collection._id) || defaultValue
        const viewOption: IViewOption =
            collection.viewOptions.find((option: any) => {
                return option._id === config.viewOption?._id
            }) || defaultValue.viewOption

        return {
            viewOption
        }
    }

    setCollectionConfig(collection: any, config: any = {}) {
        let collectionConfig: any = this.storageService.getLsElement(collection._id) || {
            viewOption: collection.viewOptions[0]
        }

        collectionConfig = Object.assign(collectionConfig, config)
        delete collectionConfig.viewOption.fields
        localStorage.setItem(collection._id, JSON.stringify(collectionConfig))
    }

    getElementsType(collection: any): 'inanimate' | 'lively' {
        return collection.classification?.elementsType
    }

    getCollectionDefaultFields(collection: any) {
        const elementsType = this.getElementsType(collection)
        switch (elementsType) {
            case 'lively':
                return DEFAULT_FIELDS_FOR_LIVELY
            case 'inanimate':
                return DEFAULT_FIELDS_FOR_INANIMATE
        }
    }

    findField(viewOptions: any, collectionConfig: any, fieldId: any) {
        const fields = this.getFields(viewOptions, collectionConfig) || []
        const index = fields.findIndex((field: any) => field._id === fieldId)
        return index !== -1 ? fields[index] : null
    }

    emitData(data: { config: any }) {
        data.config = {
            ...this.state.config,
            ...data.config
        }

        this.observer.next(data)
        this.state = { config: data.config }
    }
}
