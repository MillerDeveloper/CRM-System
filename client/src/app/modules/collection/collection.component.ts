import { TranslateService } from '@ngx-translate/core'
import { ImportElementsComponent } from './../../shared/components/dialogs/import-elements/import-elements.component'
import { getFieldValue, isJson } from '@globalShared/utils/system.utils'
import { SystemService } from './../../shared/services/system/system.service'
import { CreateCollectionElementComponent } from '@/shared/components/dialogs/create-collection-element/create-collection-element.component'
import { IFetchConfig, ILoadingConfig } from '@/shared/interfaces/global.interface'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { ChangeDetectorRef, Component, OnInit, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { CreateCollectionComponent } from '@/shared/components/dialogs/create-collection/create-collection.component'
import { ConfirmationService } from 'primeng/api'
import { CompanyService } from '@/shared/services/company/company.service'
import { CreateViewOptionComponent } from '@/shared/components/dialogs/create-view-option/create-view-option.component'
import { FieldControlsComponent } from '@/shared/components/dialogs/field-controls/field-controls.component'
import { Workbook } from 'exceljs'
import * as saveAs from 'file-saver'
import { environment } from 'src/environments/environment'
import { Subscription } from 'rxjs'
import { MigrateElementsComponent } from '@/shared/components/dialogs/migrate-elements/migrate-elements.component'
import { OnDestroy } from '@angular/core'
import { StorageService } from '@/shared/services/storage/storage.service'
import { IField } from '@globalShared/interfaces/collection.interface'
export const DEFAULT_VIEW_CONFIG = {
    viewType: 'table',
    viewOption: 'striped'
}

@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss'],
    providers: [DialogService, ConfirmationService]
})
export class CollectionComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(
        private readonly changeDetectorRef: ChangeDetectorRef,
        public readonly route: ActivatedRoute,
        private readonly dialogService: DialogService,
        private readonly collectionService: CollectionService,
        private readonly collectionElementService: CollectionElementService,
        public readonly systemService: SystemService,
        private readonly companyService: CompanyService,
        private readonly confirmationService: ConfirmationService,
        private readonly storageService: StorageService,
        private readonly translateService: TranslateService
    ) {}

    viewOptions: any[] = []
    collectionData: any = { _id: null }
    collectionConfig!: any
    collection!: any
    subscription: Subscription = new Subscription()
    fetchConfig: IFetchConfig = {
        rows: 20, // 50
        skip: 0,
        totalCount: 0,
        sort: {
            createdAt: -1
        }
    }
    elements: any[] = []
    selection: any[] = []
    viewOptionConfig!: any
    loadingConfig: ILoadingConfig = {
        isLoadingData: true,
        isFirstLoad: true
    }

    ngOnInit(): void {
        if (this.route.snapshot.paramMap.has('id')) {
            this.collectionData._id = this.route.snapshot.paramMap.get('id')

            if (this.collectionData._id) {
                this.subscription.add(
                    this.collectionService.findOne(this.collectionData._id).subscribe({
                        next: (result: any) => {
                            this.collection = result.collection
                            if (this.collection?._id) {
                                this.setView()
                                this.loadingConfig.isLoadingData = false
                                this.subscribeOnChanges()

                                const boardConfigKey = `table-${this.collectionConfig.viewOption._id}`
                                if (isJson(localStorage.getItem(boardConfigKey) ?? '')) {
                                    const boardView =
                                        this.storageService.getLsElement(boardConfigKey)

                                    if (boardView) {
                                        this.fetchConfig = boardView
                                    }
                                }

                                if (this.collectionConfig.viewOption?.viewType === 'kanban') {
                                    this.fetchElements()
                                } else {
                                    this.loadingConfig.isFirstLoad = false
                                }

                                this.changeDetectorRef.detectChanges()
                            }
                        }
                    })
                )
            }
        } else {
            this.loadingConfig.isFirstLoad = false
            this.loadingConfig.isLoadingData = false

            this.subscription.add(
                this.collectionService.findAll({}).subscribe({
                    next: (result: { collections: any[] }) => {
                        if (result.collections?.length > 0 && result.collections[0]?._id) {
                            this.systemService.refreshComponent(
                                `collection/${result.collections[0]?._id}`
                            )
                        }
                    }
                })
            )
        }
    }

    ngAfterViewInit(): void {
        this.subscription.add(
            this.route.params.subscribe({
                next: (params: any) => {
                    if (this.collection && this.collection._id !== params.id) {
                        this.loadingConfig.isFirstLoad = true
                        this.fetchConfig.filter = {}
                        this.changeDetectorRef.detectChanges()
                        this.ngOnInit()
                    }
                }
            })
        )
    }

    setView() {
        this.viewOptions = this.collection.viewOptions
        this.collectionConfig = this.collectionService.getCollectionConfig(this.collection)
    }

    subscribeOnChanges() {
        this.subscription.add(
            this.collectionService.subscriber$.subscribe({
                next: (data: { config: any }) => {
                    if (data) {
                        this.loadingConfig = data.config.loadingConfig
                        this.selection = data.config.selection
                    }
                }
            })
        )
    }

    fetchElements(fetchConfig: IFetchConfig = this.fetchConfig) {
        this.loadingConfig.isLoadingData = true

        if (this.fetchConfig.filter) {
            const externalFilters = Object.keys(this.fetchConfig.filter).filter((key: any) => {
                const filters = this.fetchConfig.filter[key].filter((filter: any) => {
                    return filter.externalFilter
                })

                return filters.length > 0
            })

            if (externalFilters.length > 0) {
                for (const key of externalFilters) {
                    fetchConfig.filter[key] = [
                        ...(fetchConfig.filter[key] || []),
                        ...this.fetchConfig.filter[key]
                    ]
                }
            }
        }

        const collectionId = this.collectionData._id ?? this.collection._id

        this.viewOptionConfig =
            this.storageService.getLsElement(this.collectionConfig.viewOption._id) || {}

        const currentStageIndex = this.viewOptionConfig?.currentStageIndex
        if (currentStageIndex && currentStageIndex !== -1) {
            if (!fetchConfig.filter) fetchConfig.filter = {}
            fetchConfig.filter.stage = [
                {
                    value: [this.viewOptionConfig.currentStageIndex],
                    matchMode: 'equals',
                    operator: 'and',
                    externalFilter: true
                }
            ]
        }

        if (!!this.viewOptionConfig.searchText) {
            const fields = this.collectionConfig.viewOption.fields
            fetchConfig = this.collectionElementService.getSearchConfig(
                this.viewOptionConfig.searchText,
                fields,
                fetchConfig
            )

            this.fetchConfig = fetchConfig
        }

        this.subscription.add(
            this.collectionElementService.findMany(collectionId, fetchConfig).subscribe({
                next: (result: { elements: any; totalCount: number }) => {
                    this.elements = result.elements
                    this.fetchConfig = fetchConfig

                    this.fetchConfig.totalCount = result.totalCount
                    this.loadingConfig.isLoadingData = false
                    this.loadingConfig.isFirstLoad = false

                    this.collectionService.emitData({
                        config: {
                            selection: []
                        }
                    })

                    // const boardConfigKey = `table-${this.collectionConfig.viewOption._id}`
                    // if (isJson(localStorage.getItem(boardConfigKey) ?? '')) {
                    //     const boardView = this.storageService.getLsElement(boardConfigKey)
                    //     this.storageService.setLsElement(boardConfigKey, {
                    //         ...boardView,
                    //         ...fetchConfig
                    //     })
                    // }

                    this.changeDetectorRef.detectChanges()
                }
            })
        )
    }

    changeView(collectionConfig: { viewOption: any }) {
        this.collectionConfig = collectionConfig
        this.collectionService.setCollectionConfig(this.collection, collectionConfig)
        this.systemService.refreshComponent()
    }

    isFiltered(): boolean {
        const isFiltered = Object.keys(this.fetchConfig.filter ?? {})?.length > 0
        return isFiltered
    }

    clearFilters() {
        if (this.fetchConfig?.filter) {
            this.fetchConfig.filter = {}
        }

        const lsKey = `table-${this.collection._id}`

        if (localStorage.getItem(lsKey)) {
            const tableView = JSON.parse(localStorage.getItem(lsKey) || '')
            localStorage.setItem(lsKey, JSON.stringify({ ...tableView, filters: {} }))
        }

        if (localStorage.getItem(`${this.collectionConfig.viewOption._id}`)) {
            const tableView = JSON.parse(
                localStorage.getItem(`${this.collectionConfig.viewOption._id}`) || ''
            )
            delete tableView.searchText
            delete tableView.currentStageIndex
            localStorage.setItem(this.collectionConfig.viewOption._id, JSON.stringify(tableView))
        }

        this.loadingConfig.isLoadingData = true
        this.loadingConfig.isFirstLoad = true
        this.fetchElements()
    }

    onCreateElement(extraData: any = {}) {
        const dialogRef = this.dialogService.open(CreateCollectionElementComponent, {
            header: this.translateService.instant('global.create'),
            data: {
                collection: this.collection,
                viewOptions: this.viewOptions,
                collectionConfig: this.collectionConfig
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any; isUpdateCollecton: boolean; collection: any }) => {
                if (result) {
                    const elementData = {
                        ...result.data,
                        ...extraData
                    }
                    this.updateCollection(result.collection)
                    this.createElement(elementData)
                }
            }
        })
    }

    createElement(
        element: any,
        config: { fetchNewElements: boolean } = { fetchNewElements: true }
    ) {
        this.loadingConfig.isLoadingData = true
        this.collectionElementService.create({ data: element }).subscribe({
            next: (result: { element: any }) => {
                if (config.fetchNewElements) {
                    this.fetchElements()
                } else {
                    this.elements.push(result.element)
                }
            }
        })
    }

    onCreateField() {
        const dialogRef = this.dialogService.open(FieldControlsComponent, {
            header: 'Create new field',
            data: {
                modalMode: 'create',
                collection: this.collection
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any; mode: string }) => {
                if (result) {
                    this.addField({
                        field: result.data,
                        mode: result.mode
                    })
                }
            }
        })
    }

    onCreateViewOption() {
        const dialogRef = this.dialogService.open(CreateViewOptionComponent, {
            header: 'Create view option',
            data: {
                collection: this.collection
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any }) => {
                if (result) {
                    const migrationFieldTypes: any[] = ['select', 'multiselect']
                    const fields: any[] = this.viewOptions[0].fields.filter((field: IField) =>
                        migrationFieldTypes.includes(field.fieldType)
                    )
                    this.collection.viewOptions.push({
                        ...result.data,
                        fields: fields
                    })

                    this.updateCollection()
                }
            }
        })
    }

    updateCollection(collection?: any, reload: boolean = false) {
        this.loadingConfig.isLoadingData = true
        if (collection) {
            this.collection = collection
        }

        this.collectionService.update(this.collection).subscribe({
            next: async (result: { collection: any }) => {
                if (result.collection) {
                    this.collection = result.collection
                }

                await this.companyService.init()

                if (reload) {
                    this.systemService.refreshComponent()
                }

                this.setView()
                this.changeDetectorRef.detectChanges()
                this.loadingConfig.isLoadingData = false
            }
        })
    }

    updateElement({ element, index, reload }: { element: any; index?: number; reload?: boolean }) {
        this.collectionElementService.update(element).subscribe({
            next: (result: { element: any }) => {
                if (reload) {
                    if (typeof index === 'number') {
                        this.elements.splice(index, 1, result.element)
                    } else {
                        index = this.elements.findIndex(
                            (element: any) => element._id === result.element._id
                        )
                    }

                    if (index !== -1) {
                        this.elements.splice(index, 1, result.element)
                    }

                    this.changeDetectorRef.detectChanges()
                }
            }
        })
    }

    onCreateCollection() {
        const dialogRef: DynamicDialogRef = this.dialogService.open(CreateCollectionComponent, {
            header: this.translateService.instant('collection.createCollection')
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any; createdType: string }) => {
                this.collectionService.createCollection(result.data).subscribe({
                    next: async (result: { collection: any }) => {
                        if (result) {
                            await this.companyService.init()
                            this.changeDetectorRef.detectChanges()

                            this.systemService.refreshComponent(
                                `/collection/${result.collection._id}`
                            )
                        }
                    }
                })
            }
        })
    }

    deleteCollection() {
        this.collectionService.deleteOne(this.collection._id).subscribe({
            next: () => {
                this.systemService.refreshComponent(`/collection`)
            }
        })
    }

    deleteElements() {
        const ids = this.selection.map((element: any) => element._id)
        this.collectionElementService.deleteMany(ids).subscribe({
            next: () => {
                this.selection = []
                this.collectionService.emitData({
                    config: {
                        selection: this.selection
                    }
                })

                this.collectionService.emitData({ config: { selection: this.selection } })
                this.fetchElements()
            }
        })
    }

    confirmDeletion(deletionElementType: 'element' | 'collection') {
        const icon = 'pi pi-exclamation-triangle'
        if (deletionElementType === 'element') {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete?',
                header: 'Confirmation',
                icon: icon,
                accept: () => {
                    this.deleteElements()
                }
            })
        } else {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete collection?',
                header: 'Confirmation',
                icon: icon,
                accept: () => {
                    this.deleteCollection()
                }
            })
        }
    }

    search(text: string) {
        const fields = this.collectionConfig.viewOption.fields
        let fetchConfig = this.collectionElementService.getSearchConfig(
            text,
            fields,
            this.fetchConfig
        )

        this.fetchConfig = fetchConfig
        this.fetchElements()
    }

    migrateElements() {
        this.dialogService
            .open(MigrateElementsComponent, {
                header: 'Migrate Elements'
            })
            .onClose.subscribe({
                next: (response: { collection: any }) => {
                    if (response) {
                        const ids = this.selection.map((element: any) => element._id)
                        this.collectionElementService
                            .migrateMany(ids, response.collection._id)
                            .subscribe({
                                next: () => {
                                    this.selection = []
                                    this.collectionService.emitData({
                                        config: {
                                            selection: this.selection
                                        }
                                    })

                                    this.collectionService.emitData({
                                        config: { selection: this.selection }
                                    })

                                    this.fetchElements()
                                }
                            })
                    }
                }
            })
    }

    duplicateElements() {
        this.selection.forEach((element: any, index: number) => {
            delete element._id
            this.createElement(element, { fetchNewElements: index === this.selection.length - 1 })
        })

        this.selection = []
        this.collectionService.emitData({ config: { selection: this.selection } })
    }

    addField(data: { field: any; mode: string }) {
        const collection = this.collection
        const index = this.collection.viewOptions.findIndex(
            (option: any) => option._id === this.collectionConfig.viewOption._id
        )

        if (index !== -1) {
            switch (data.mode) {
                case 'collection': {
                    collection.viewOptions[index].fields.push({
                        collectionRef: {
                            data: data.field._id
                        },
                        label: data.field.label.text,
                        fieldType: 'collectionElement'
                    })
                    break
                }
                case 'field': {
                    collection.viewOptions[index].fields.push(data.field)
                    break
                }
            }
        }

        this.updateCollection(collection, true)
    }

    applyFilters(filters: any) {
        this.fetchConfig.filter = { ...this.fetchConfig.filter, ...filters }
        if (!filters.stage) {
            delete this.fetchConfig.filter?.stage
        }

        this.fetchElements()
    }

    onExport(exportFormat: string) {
        this.loadingConfig.isLoadingData = true

        const workbook = new Workbook()
        const worksheetName = this.collection.label.text
            .replace(/[@!^&\/\\#,+()$~%.'":*?<>{}]/g, '')
            .trim()
        const worksheet = workbook.addWorksheet(worksheetName)
        const fields = this.collectionConfig.viewOption.fields

        const worksheetColumns: any[] = fields.reduce((acc: any[], field: any) => {
            acc.push({
                header: field.label,
                key: field._id,
                width: 40
            })

            return acc
        }, [])

        const rows = this.elements.reduce((acc: any[], element: any) => {
            const data: any = {}
            fields.forEach((field: any) => {
                data[field._id] = this.collectionElementService.getGroupedFieldValue(
                    field,
                    getFieldValue(element, field)
                )
            })

            acc.push(data)
            return acc
        }, [])

        worksheet.columns = worksheetColumns
        workbook.creator = environment.crmName

        worksheet.addRows(rows)

        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            })

            saveAs(blob, `${this.collection.label.text}.xlsx`)
            this.fetchElements()
        })
    }

    async onImport() {
        const dialogRef = this.dialogService.open(ImportElementsComponent, {
            header: 'Import elements',
            data: {
                collection: this.collection,
                fields: this.collectionConfig.viewOption.fields
            }
        })

        dialogRef.onClose.subscribe({
            next: (data: { elements: any[] }) => {
                if (data) {
                    this.collectionElementService.createMany({ data: data.elements }).subscribe({
                        next: () => {
                            this.fetchElements()
                        }
                    })
                }
            }
        })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
