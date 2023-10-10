import { TranslateService } from '@ngx-translate/core'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { StorageService } from '@/shared/services/storage/storage.service'
import { ITableConfig } from '@/shared/interfaces/global.interface'
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DoCheck,
    EventEmitter,
    Inject,
    Input,
    KeyValueDiffer,
    KeyValueDiffers,
    OnInit,
    Output
} from '@angular/core'
import { MenuItem } from 'primeng/api'
import { Router } from '@angular/router'
import { isJson } from '@globalShared/utils/system.utils'
import { UserService } from '@/shared/services/user/user.service'
import { IViewOption } from '@globalShared/interfaces/collection.interface'
import { DOCUMENT } from '@angular/common'

@Component({
    selector: 'app-table-view',
    templateUrl: './table-view.component.html',
    styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements OnInit, AfterViewInit, DoCheck {
    @Input() config!: ITableConfig
    @Output() onCreateField: EventEmitter<any> = new EventEmitter()
    @Output() fetchData: EventEmitter<any> = new EventEmitter()
    @Output() updateElement: EventEmitter<any> = new EventEmitter()
    @Output() addField: EventEmitter<any> = new EventEmitter()
    @Output() onDeletion: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly storageService: StorageService,
        private readonly differs: KeyValueDiffers,
        public readonly collectionService: CollectionService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly router: Router,
        private readonly translateService: TranslateService,
        public readonly userService: UserService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    private configDiffer!: KeyValueDiffer<string, any>
    tableConfigKey!: string
    tableHeight: number = 0
    collectionConfig!: {
        viewOption: IViewOption
    }
    selectedElement!: any
    updateTimeout!: any
    viewOptionConfig: any = {
        styleOption: 'gridlines'
    }
    contextTableMenuOptions: MenuItem[] = [
        {
            label: 'Open card',
            icon: 'pi pi-fw pi-search',
            command: () => this.openCard()
        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-times',
            command: () => {
                this.config.selection = [this.selectedElement]
                this.onDeletion.emit()
            }
        }
    ]

    fields: any[] = []

    ngOnInit(): void {
        if (this.config?.collection) {
            this.collectionConfig = this.collectionService.getCollectionConfig(
                this.config.collection
            )

            this.fields = this.collectionService.getFields(
                this.config.collection.viewOptions,
                this.collectionConfig.viewOption._id
            )

            this.tableConfigKey = `table-${this.collectionConfig.viewOption._id}`

            const columnOrder =
                this.storageService.getLsElement(this.tableConfigKey)?.columnOrder || []
            this.fields.sort((a, b) => columnOrder.indexOf(a) - columnOrder.indexOf(b))
            this.viewOptionConfig = this.storageService.getLsElement(
                this.collectionConfig.viewOption._id
            )
            this.configDiffer = this.differs.find(this.config).create()
            this.changeDetectorRef.detectChanges()
        } else {
            throw new Error('Collection is not configured')
        }
    }

    ngAfterViewInit(): void {
        this.setTableHeight()
    }

    setTableHeight() {
        const tableTop: number = this.document.querySelector('#table-view')?.getBoundingClientRect()
            .top as number
        const contentScrollHeight: number = this.document.querySelector('.content')
            ?.scrollHeight as number
        const paginatorHeight: number =
            (this.document.querySelector('.p-paginator')?.getBoundingClientRect()
                .height as number) || 0
        this.tableHeight = contentScrollHeight - tableTop - paginatorHeight
    }

    ngDoCheck(): void {
        const changes = this.configDiffer?.diff(this.config)
        if (changes) {
            this.collectionService.emitData({ config: this.config })
            this.setTableHeight()
        }
    }

    offset(el: any) {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.screenX || document.documentElement.scrollLeft,
            scrollTop = window.screenY || document.documentElement.scrollTop
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    createColumn() {
        this.onCreateField.emit()
    }

    onFetchData(event: {
        filters: any
        sortField: string
        sortOrder: number
        rows: number
        first: number
    }) {
        const filters = { ...event.filters }
        Object.keys(filters).forEach((key: string) => {
            if (!Array.isArray(filters[key])) {
                delete filters[key]
                return
            }

            filters[key] = filters[key].filter((fl: any) => {
                if (!fl?.value) {
                    return false
                } else if (Array.isArray(fl.value) && fl.value.length === 0) {
                    return false
                }

                return fl
            })

            if (filters[key].length === 0) {
                delete filters[key]
            }
        })

        if (isJson(localStorage.getItem(this.tableConfigKey) ?? '')) {
            const tableView = this.storageService.getLsElement(this.tableConfigKey)
            this.storageService.setLsElement(this.tableConfigKey, {
                ...tableView,
                filters: filters
            })
        }

        const sort: any = {}

        switch (event.sortField) {
            case 'createdAt':
            case 'updatedAt': {
                sort[event.sortField] = event.sortOrder
                break
            }
            default: {
                sort[`${event.sortField || 'createdAt'}.value`] = event.sortOrder
            }
        }

        this.config.fetchConfig = {
            filter: filters,
            sort: sort,
            totalCount: this.config.fetchConfig.totalCount,
            rows: event.rows || 5,
            skip: event.first || 0
        }

        this.fetchData.emit(this.config.fetchConfig)
        this.changeDetectorRef.detectChanges()
    }

    openCard(element: any = this.selectedElement) {
        this.router.navigate(['collection', this.config.collection._id, element._id])
    }

    onSelectionChange(selection: any[]) {
        this.config.selection = selection
        this.collectionService.emitData({ config: this.config })
    }

    onUpdateElement(element: any, index: number) {
        this.updateElement.emit({ element, index })
    }

    onColResize(event: any) {
        setTimeout(() => {
            if (this.storageService.getLsElement(this.tableConfigKey)) {
                const tableConfig = this.storageService.getLsElement(this.tableConfigKey)

                if (tableConfig?.columnWidths) {
                    const splitedColumnWidth = tableConfig.columnWidths.split(',')

                    splitedColumnWidth[0] = '43'
                    tableConfig.columnWidths = splitedColumnWidth.join(',')
                    this.storageService.setLsElement(this.tableConfigKey, tableConfig)
                }
            }
        }, 20)
    }

    findFieldOptions(fieldId: string, extraData: any = {}) {
        const data = this.collectionService.findField(
            this.config.collection.viewOptions,
            this.collectionConfig.viewOption._id,
            fieldId
        )?.options

        return [...data, extraData]
    }

    isDefaultFieldType(type: string) {
        return ['text', 'date', 'datetime', 'number'].includes(type)
    }

    hasRight(rightPath: string, config: { mustEqualTo?: any; mustNotEqualTo?: any }) {
        return this.userService.hasSystemRight({
            rightPath: rightPath,
            rights: this.userService.currentUser.rights.system?.modules,
            mustEqualTo: config.mustEqualTo || undefined,
            mustNotEqualTo: config.mustNotEqualTo || undefined
        })
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

    getFieldLabel(field: any) {
        return !!field.label ? field.label : this.translateService.instant('fields.' + field._id)
    }
}
