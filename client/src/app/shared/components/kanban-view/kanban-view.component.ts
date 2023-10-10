import { TranslateService } from '@ngx-translate/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { getFieldValue, isJson } from '@globalShared/utils/system.utils'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { ITableConfig } from '@/shared/interfaces/global.interface'
import {
    Component,
    EventEmitter,
    Output,
    OnInit,
    Input,
    KeyValueDiffer,
    KeyValueDiffers,
    ChangeDetectorRef,
    DoCheck,
    OnDestroy,
    Inject,
    AfterContentChecked
} from '@angular/core'
import { ICollectionConfig } from '@/shared/interfaces/collection.interface'
import { IField, IViewOption } from '@globalShared/interfaces/collection.interface'
import { Subscription } from 'rxjs'
import { DOCUMENT } from '@angular/common'
import { MenuItem } from 'primeng/api'
import { NAME_FIELD } from '@globalShared/constants/element.constants'
import { Router } from '@angular/router'
import { StorageService } from '@/shared/services/storage/storage.service'

@Component({
    selector: 'app-kanban-view',
    templateUrl: './kanban-view.component.html',
    styleUrls: ['./kanban-view.component.scss']
})
export class KanbanViewComponent implements OnInit, AfterContentChecked, DoCheck, OnDestroy {
    @Input() config!: ITableConfig
    @Output() fetchData: EventEmitter<any> = new EventEmitter()
    @Output() updateElement: EventEmitter<any> = new EventEmitter()
    @Output() updateCollection: EventEmitter<any> = new EventEmitter()
    @Output() onCreateElement: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly collectionService: CollectionService,
        private readonly differs: KeyValueDiffers,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly translateService: TranslateService,
        private readonly router: Router,
        private readonly storageService: StorageService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    private configDiffer!: KeyValueDiffer<string, any>
    collectionConfig!: ICollectionConfig
    subscription: Subscription = new Subscription()
    fields: any[] = []
    viewHeight: number = 0
    selectedStageIndex!: number
    currentElementDragged!: any
    selectedElementIndex!: number
    stageMenu: MenuItem[] = [
        {
            label: this.translateService.instant('global.delete'),
            icon: 'pi pi-trash',
            command: () => {
                this.deleteStage()
            }
        }
    ]
    stageCounter: any = {}
    nameField: any = NAME_FIELD
    stageForm: FormGroup = new FormGroup({
        label: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        bgColor: new FormControl(null, Validators.required),
        index: new FormControl(null)
    })
    stages: any[] = [
        {
            label: 'No one stage',
            index: 0
        },
        {
            label: 'First stage',
            index: 1
        }
    ]

    ngOnInit(): void {
        if (this.config?.collection) {
            this.collectionConfig = this.collectionService.getCollectionConfig(
                this.config.collection
            )
            this.fields = this.collectionService.getFields(
                this.config.collection.viewOptions,
                this.collectionConfig.viewOption._id
            )

            this.stages = this.fields.find((field: any) => field._id === 'stage')?.options || []
            this.configDiffer = this.differs.find(this.config).create()
            this.changeDetectorRef.detectChanges()
        }
    }

    ngAfterContentChecked(): void {
        this.setViewHeight()
    }

    ngDoCheck(): void {
        const changes = this.configDiffer?.diff(this.config)

        if (changes) {
            this.collectionService.emitData({ config: this.config })
        }
    }

    setViewHeight() {
        const kanbanBlock: any = this.document.querySelector('#kanban-view')
        const paginatorHeight: number =
            (this.document.querySelector('.p-paginator')?.getBoundingClientRect()
                .height as number) || 0

        if (kanbanBlock) {
            this.viewHeight =
                window.innerHeight -
                kanbanBlock.offsetTop / 2 -
                paginatorHeight -
                (kanbanBlock.getBoundingClientRect().top + 5) / 2
        } else {
            throw new Error('View height can not be calculated')
        }
    }

    onDrop(event: any, stage: any) {
        event.preventDefault()

        if (this.config.elements[this.selectedElementIndex].stage?.index === stage.index) {
            return
        } else {
            this.config.elements[this.selectedElementIndex].stage = {
                value: stage
            }
            this.updateElement.emit({
                element: this.config.elements[this.selectedElementIndex],
                index: this.selectedElementIndex
            })
            this.changeDetectorRef.detectChanges()
        }
    }

    onDragStart(elementIndex: number) {
        this.selectedElementIndex = elementIndex
    }

    getElementValue(element: any, field: any) {
        return getFieldValue(element, field)
    }

    isHasStage(element: any) {
        if (!element) {
            return
        }

        if (
            !element.stage ||
            !element.stage?.value ||
            typeof element.stage?.value?.index !== 'number'
        ) {
            return false
        }

        const elementStage = element.stage.value

        if (elementStage.index < 0 || elementStage.index > this.stages.length) {
            return false
        }

        return true
    }

    openCard(element: any) {
        this.router.navigate(['collection', this.config.collection._id, element._id])
    }

    addStage() {
        const stageData = {
            ...this.stageForm.value,
            index: this.stages.length
        }

        const viewOptionIndex = this.config.collection.viewOptions.findIndex(
            (viewOption: IViewOption) => viewOption._id === this.collectionConfig.viewOption._id
        )

        if (viewOptionIndex !== -1) {
            const fieldIndex = this.config.collection.viewOptions[viewOptionIndex].fields.findIndex(
                (field: IField) => field._id === 'stage'
            )

            if (fieldIndex !== -1) {
                this.config.collection.viewOptions[viewOptionIndex].fields[fieldIndex].options.push(
                    stageData
                )

                this.updateCollection.emit(this.config.collection)
                this.changeDetectorRef.detectChanges()
            }
        }

        this.stageForm.reset()
    }

    deleteStage() {
        const viewOptionIndex = this.config.collection.viewOptions.findIndex(
            (viewOption: IViewOption) => viewOption._id === this.collectionConfig.viewOption._id
        )

        if (viewOptionIndex !== -1) {
            const fieldIndex = this.config.collection.viewOptions[viewOptionIndex].fields.findIndex(
                (field: IField) => field._id === 'stage'
            )

            if (fieldIndex !== -1) {
                this.config.collection.viewOptions[viewOptionIndex].fields[
                    fieldIndex
                ].options.splice(this.selectedStageIndex, 1)

                this.updateCollection.emit(this.config.collection)
                this.changeDetectorRef.detectChanges()
            }
        }
    }

    onPaginatorChange(event: any) {
        this.config.fetchConfig = {
            filter: {},
            sort: {
                createdAt: -1
            },
            totalCount: this.config.fetchConfig.totalCount,
            rows: event.rows || 5,
            skip: event.first || 0
        }

        this.fetchData.emit(this.config.fetchConfig)

        const boardConfigKey = `table-${this.collectionConfig.viewOption._id}`
        if (isJson(localStorage.getItem(boardConfigKey) ?? '')) {
            const boardView = this.storageService.getLsElement(boardConfigKey) || {}

            this.storageService.setLsElement(boardConfigKey, {
                ...boardView,
                ...this.config.fetchConfig
            })
        } else {
            this.storageService.setLsElement(boardConfigKey, this.config.fetchConfig)
        }

        this.changeDetectorRef.detectChanges()
    }

    onCreateBoardElement(stage: any) {
        this.onCreateElement.emit({
            stage: {
                value: stage
            }
        })
    }

    toggleSelect(element: any) {
        const index = this.config.selection.findIndex((elem: any) => elem._id === element._id)
        if (index !== -1) {
            this.config.selection.splice(index, 1)
        } else {
            this.config.selection.push(element)
        }

        this.collectionService.emitData({ config: this.config })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
