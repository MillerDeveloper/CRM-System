import { TranslateService } from '@ngx-translate/core'
import { StorageService } from './../../../shared/services/storage/storage.service'
import { COLLECTION_TYPES } from '@globalShared/constants/collection.constants'
import { SystemService } from '@/shared/services/system/system.service'
import { FieldControlsComponent } from '@/shared/components/dialogs/field-controls/field-controls.component'
import { InitialElementFieldsComponent } from '@/shared/components/dialogs/initial-element-fields/initial-element-fields.component'
import {
    KANBAN_VIEW_OPTIONS,
    TABLE_VIEW_OPTIONS,
    VIEW_TYPES
} from '@/shared/constants/global.constants'
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    KeyValueDiffer,
    KeyValueDiffers,
    OnInit,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { IFilter, IToolbarConfig } from '@/shared/interfaces/global.interface'
import { Dropdown } from 'primeng/dropdown'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { DialogService } from 'primeng/dynamicdialog'
import { LayoutService } from '@/shared/services/layout/layout.service'
import { UserService } from '@/shared/services/user/user.service'
import { isJson } from '@globalShared/utils/system.utils'
import { IViewOption } from '@globalShared/interfaces/collection.interface'

interface IFilterConfig {
    matchMode: string
    filters: IFilter[]
}

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
    @Input() config!: IToolbarConfig
    @ViewChildren('dropdownColumn') dropdownColumnRefs!: QueryList<Dropdown>
    @Output() changeView: EventEmitter<any> = new EventEmitter()
    @Output() clearFilters: EventEmitter<any> = new EventEmitter()
    @Output() applyFilters: EventEmitter<IFilter[]> = new EventEmitter()
    @Output() onCreateElement: EventEmitter<any> = new EventEmitter()
    @Output() reloadData: EventEmitter<any> = new EventEmitter()
    @Output() onCreateViewOption: EventEmitter<any> = new EventEmitter()
    @Output() updateCollection: EventEmitter<any> = new EventEmitter()
    @Output() onDeletion: EventEmitter<any> = new EventEmitter()
    @Output() addField: EventEmitter<any> = new EventEmitter()
    @Output() onCreateField: EventEmitter<any> = new EventEmitter()
    @Output() duplicateElements: EventEmitter<any> = new EventEmitter()
    @Output() search: EventEmitter<any> = new EventEmitter()
    @Output() onExport: EventEmitter<any> = new EventEmitter()
    @Output() onImport: EventEmitter<any> = new EventEmitter()
    @Output() migrateElements: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly changeDetectionRef: ChangeDetectorRef,
        private readonly collectionService: CollectionService,
        private readonly differs: KeyValueDiffers,
        private readonly dialogService: DialogService,
        public readonly systemService: SystemService,
        public readonly layoutService: LayoutService,
        public readonly userService: UserService,
        private readonly storageService: StorageService,
        private readonly translateService: TranslateService,
        private readonly confirmationService: ConfirmationService
    ) {}

    private configDiffer!: KeyValueDiffer<string, any>
    viewTypes = VIEW_TYPES
    selectViewOption!: any
    fields: any[] = []
    viewOptions: any[] = []
    adittionalViewOptions: any[] = []
    collectionConfig: any = {
        viewOption: {}
    }
    collectionTypes: any[] = COLLECTION_TYPES
    filterConfig: IFilterConfig = {
        matchMode: 'and',
        filters: []
    }
    viewOptionConfig!: any
    addButtonModel: MenuItem[] = []
    menuImportExportModel: MenuItem[] = []
    filters: any = {}
    adittionalSizeOptions: any[] = [
        {
            label: this.translateService.instant('global.small'),
            value: 'p-datatable-sm'
        },
        {
            label: this.translateService.instant('global.normal'),
            value: ''
        },
        {
            label: this.translateService.instant('global.large'),
            value: 'p-datatable-lg'
        }
    ]
    searchTimeout!: any
    matchModes = [
        { label: 'And', value: 'and' },
        { label: 'Or', value: 'or' }
    ]
    settingsMenu: MenuItem[] = [
        {
            label: 'Add column',
            icon: 'pi pi-plus'
        },
        {
            label: 'Switch to gridlines',
            icon: 'pi pi-plus'
        }
    ]

    stages: any[] = []
    viewOptionsIcons: any[] = [
        { icon: 'pi pi-align-justify', viewType: 'table' },
        // { icon: 'pi pi-table', viewType: 'cards' },
        { icon: 'pi pi-ellipsis-v', viewType: 'kanban' }
    ]
    editableVOId!: string | undefined

    ngOnInit(): void {
        if (this.config?.collection) {
            this.initToolbar()
        } else {
            throw new Error('Collection not configured')
        }

        this.configDiffer = this.differs.find(this.config).create()
    }

    initToolbar() {
        this.collectionConfig = this.collectionService.getCollectionConfig(this.config.collection)
        this.viewOptionConfig =
            this.storageService.getLsElement(this.collectionConfig.viewOption._id) || {}
        this.viewOptions = this.config.collection.viewOptions

        this.fields = this.collectionConfig.viewOption.fields
        this.viewOptions = this.viewOptions.filter((option: any) => {
            if (!option.label) {
                option.label = this.translateService.instant(`collection.${option.viewType}View`)
            }

            return option.viewType !== 'card'
        })

        this.addButtonModel = [
            {
                label: this.translateService.instant('global.createView'),
                icon: 'pi pi-plus',
                disabled: !this.userService.hasCollectionRight({
                    collectionId: this.config.collection._id,
                    rights: this.userService.currentUser.rights.collections,
                    right: 'edit',
                    mustEqualTo: 'allowed'
                }),
                command: () => {
                    this.onCreateViewOption.emit()
                }
            },
            {
                label: this.translateService.instant('global.delete'),
                icon: 'pi pi-trash',
                disabled: this.config.selection.length === 0,
                command: () => {
                    this.onDeletion.emit()
                }
            },
            {
                label: this.translateService.instant('global.duplicate'),
                icon: 'pi pi-copy',
                disabled: this.config.selection.length === 0,
                command: () => {
                    this.duplicateElements.emit()
                }
            }
        ]

        this.menuImportExportModel = [
            {
                label: this.translateService.instant('global.export'),
                icon: 'pi pi-download',
                disabled: this.hasCollectionRight({
                    collectionId: this.config.collection._id,
                    rights: this.userService.currentUser.rights.collections,
                    right: 'export',
                    mustEqualTo: false
                }),
                command: () => this.onExport.emit()
            },
            {
                label: this.translateService.instant('global.import'),
                icon: 'pi pi-upload',
                disabled: this.hasCollectionRight({
                    collectionId: this.config.collection._id,
                    rights: this.userService.currentUser.rights.collections,
                    right: 'import',
                    mustEqualTo: false
                }),
                command: () => this.onImport.emit()
            }
        ]

        if (this.viewOptionConfig.showFilterLine) {
            this.stages = this.collectionService.findField(
                this.config.collection.viewOptions,
                this.collectionConfig.viewOption._id,
                'stage'
            )?.options
        }

        this.selectViewOptions()
    }

    ngAfterViewInit(): void {
        this.subscribeOnChanges()
    }

    onFilter(event: any, filter: string) {
        switch (filter) {
            case 'stage': {
                const stageIndex = event.index - 1

                if (stageIndex !== -1) {
                    this.filters.stage = [
                        {
                            value: [stageIndex],
                            matchMode: 'equals',
                            operator: 'and',
                            externalFilter: true
                        }
                    ]

                    this.viewOptionConfig.currentStageIndex = stageIndex
                } else {
                    delete this.filters.stage
                    delete this.viewOptionConfig.currentStageIndex
                }

                const key = `${this.collectionConfig.viewOption._id}`
                const config = this.storageService.getLsElement(key) || this.viewOptionConfig
                config.currentStageIndex = stageIndex
                this.storageService.setLsElement(key, config)

                const tableConfigKey = `table-${this.collectionConfig.viewOption._id}`
                if (
                    isJson(localStorage.getItem(tableConfigKey) || '') &&
                    this.storageService.getLsElement(tableConfigKey)
                ) {
                    const tableView = this.storageService.getLsElement(tableConfigKey)
                    const filters = {
                        ...tableView.filters,
                        stage: this.filters.stage
                    }

                    this.storageService.setLsElement(tableConfigKey, {
                        ...tableView,
                        filters: filters
                    })
                }

                this.applyFilters.emit(this.filters)
                break
            }
        }
    }

    onSearch(text: any = '', immediately: boolean = false): void {
        clearTimeout(this.searchTimeout)
        text = text?.trim()

        if (immediately) {
            this.search.emit(text)
        } else {
            this.searchTimeout = setTimeout(() => {
                this.search.emit(text)
            }, 1000)
        }

        this.viewOptionConfig.searchText = text
        const key = this.collectionConfig.viewOption._id
        const config = this.storageService.getLsElement(key) || this.viewOptionConfig
        config.searchText = text
        this.storageService.setLsElement(key, config)
    }

    ngDoCheck(): void {
        const changes = this.configDiffer.diff(this.config)
        if (changes) {
            this.collectionService.emitData({ config: this.config })
        }
    }

    subscribeOnChanges() {
        this.collectionService.subscriber$.subscribe({
            next: (data: any) => {
                this.config.loadingConfig = data.config.loadingConfig
                this.config.selection = data.config.selection

                this.initToolbar()
            }
        })
    }

    confirmViewoptionDeletion(viewOption: IViewOption) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this view option?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                const index = this.config.collection.viewOptions.findIndex(
                    (vOption: IViewOption) => vOption._id === viewOption._id
                )

                if (index > 0) {
                    this.config.collection.viewOptions.splice(index, 1)
                    this.updateCollection.emit(this.config.collection)
                    this.collectionConfig.viewOption = this.config.collection.viewOptions[0]
                    this.onChangeView(null, 'viewOption')
                }
            }
        })
    }

    selectViewOptions() {
        switch (this.collectionConfig.viewOption.viewType) {
            case 'table': {
                this.adittionalViewOptions = TABLE_VIEW_OPTIONS
                break
            }
            case 'kanban': {
                this.adittionalViewOptions = KANBAN_VIEW_OPTIONS
                break
            }
        }
    }

    changeViewType(event: { value: string }) {
        const currentVOId = this.collectionConfig.viewOption._id
        const index = this.config.collection.viewOptions.findIndex(
            (viewOption: IViewOption) => viewOption._id === currentVOId
        )

        if (index !== -1) {
            this.config.collection.viewOptions[index].viewType = event.value
            this.updateCollection.emit(this.config.collection)
        }
    }

    editViewOptionLabel(event: any, viewOption: any) {
        event.stopPropagation()

        if (this.editableVOId) {
            this.editableVOId = undefined

            const currentVOId = this.collectionConfig.viewOption._id
            const index = this.config.collection.viewOptions.findIndex(
                (viewOption: IViewOption) => viewOption._id === currentVOId
            )

            if (index !== -1) {
                this.config.collection.viewOptions[index].label =
                    this.collectionConfig.viewOption.label
                this.updateCollection.emit(this.config.collection)
            }
        } else {
            this.editableVOId = viewOption._id
        }
    }

    addFilter(): void {
        this.filterConfig.filters.push({
            matchMode: 'contains',
            field: '',
            value: ''
        })

        this.changeDetectionRef.detectChanges()
        const columnDropDowns = this.dropdownColumnRefs.toArray()
        columnDropDowns[columnDropDowns.length - 1]?.show()
    }

    onChangeView(event: any, type: string) {
        switch (type) {
            case 'viewOption': {
                // this.collectionConfig.viewOption = event.value
                break
            }
            default: {
                const key = this.collectionConfig.viewOption._id
                const config = this.storageService.getLsElement(key) || {}
                config[type] = event.value || event.checked
                this.storageService.setLsElement(key, config)
            }
        }

        this.changeView.emit(this.collectionConfig)
    }

    onClearFilters() {
        this.filterConfig.filters = []
        // const lsKey = `table-${this.collectionConfig.viewOption._id}`

        // if (localStorage.getItem(lsKey)) {
        //     const tableView = JSON.parse(localStorage.getItem(lsKey) || '')
        //     localStorage.setItem(lsKey, JSON.stringify({ ...tableView, filters: {} }))
        // }

        this.config.loadingConfig.isLoadingData = true
        this.clearFilters.emit()
    }

    onApplyFilters() {
        this.applyFilters.emit(this.filterConfig.filters)
    }

    removeField(index: number) {
        this.fields.splice(index, 1)
        this.onUpdateFields()
    }

    onUpdateFields() {
        const fieldsMap = this.fields.map((field: any) => field._id)
        const config = this.storageService.getLsElement(`table-${this.config.collection._id}`) || []
        config.columnOrder = fieldsMap
        this.storageService.setLsElement(`table-${this.config.collection._id}`, config)

        this.config.collection.viewOptions = this.viewOptions
        this.updateCollection.emit(this.config.collection)
        this.changeDetectionRef.detectChanges()
        this.systemService.refreshComponent()
    }

    onSettingInitialElementFields() {
        const dialogRef = this.dialogService.open(InitialElementFieldsComponent, {
            header: this.translateService.instant('settings.initialFields'),
            data: {
                viewOptions: this.viewOptions,
                collectionConfig: this.collectionConfig.viewOption
            }
        })

        dialogRef.onClose.subscribe({
            next: (data: { fields: any[] }) => {
                if (data) {
                    this.viewOptions = this.collectionService.setFields(
                        this.viewOptions,
                        this.collectionConfig.viewOption._id,
                        data.fields
                    )

                    this.config.collection.viewOptions = this.viewOptions
                    this.updateCollection.emit(this.config.collection)
                }
            }
        })
    }

    onSettingField(index: number) {
        const dialogRef = this.dialogService.open(FieldControlsComponent, {
            header: 'Setting field',
            data: {
                modalMode: 'update',
                collection: this.config.collection,
                field: this.fields[index]
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any[] }) => {
                if (result) {
                    this.fields[index] = result.data
                    this.onUpdateFields()
                }
            }
        })
    }

    hasSystemRight(rightPath: string, config: { mustEqualTo?: any; mustNotEqualTo?: any }) {
        return this.userService.hasSystemRight({
            rightPath: rightPath,
            rights: this.userService.currentUser.rights.system?.modules,
            mustEqualTo: config.mustEqualTo || undefined,
            mustNotEqualTo: config.mustNotEqualTo || undefined
        })
    }

    isNumber(number: any) {
        return !isNaN(number)
    }

    getFieldLabel(field: any) {
        return !!field.label ? field.label : this.translateService.instant('fields.' + field._id)
    }

    hasCollectionRight(config: {
        collectionId: any
        rights: any
        right: any
        mustEqualTo?: any
        mustNotEqualTo?: any
    }) {
        return this.userService.hasCollectionRight({
            collectionId: this.config.collection._id,
            rights: this.userService.currentUser.rights.collections,
            right: config.right,
            mustEqualTo: config.mustEqualTo
        })
    }
}
