import { IFetchConfig, ILoadingConfig } from '@/shared/interfaces/global.interface'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog'
import { ConnectElementFieldsComponent } from '../connect-element-fields/connect-element-fields.component'

@Component({
    selector: 'app-connect-to-element',
    templateUrl: './connect-to-element.component.html',
    styleUrls: ['./connect-to-element.component.scss']
})
export class ConnectToElementComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly dialogService: DialogService,
        private readonly collectionService: CollectionService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly collectionElementService: CollectionElementService
    ) {}

    collections: any[] = []
    elements: any[] = []
    selectedElements: any[] = []
    fields: any[] = []
    collectionConfig!: any
    selectedCollection!: any
    state: any = {
        isSelectCollection: true,
        isSelectElements: false,
        isUpdateFields: false
    }
    selectedFieldsType: any = 'initial'
    fieldsType: any[] = [
        {
            label: 'Initial fields',
            value: 'initial'
        },
        {
            label: 'All fields',
            value: 'all'
        }
    ]
    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }

    fetchConfig: IFetchConfig = {
        rows: 50,
        skip: 0,
        totalCount: 0
    }

    ngOnInit(): void {
        this.loadingConfig.isLoadingData = true

        if (this.config.data?.selectedCollectionId) {
            this.collectionService.findOne(this.config.data.selectedCollectionId).subscribe({
                next: (response: { collection: any }) => {
                    this.onSelectCollection(response.collection)
                }
            })
        } else {
            this.collectionService.findAll({ ['settings.connection.isVisible']: true }).subscribe({
                next: (result: { collections: any[] }) => {
                    this.collections = result.collections
                    this.loadingConfig.isLoadingData = false
                }
            })
        }

        this.subscribeOnChanges()
    }

    subscribeOnChanges() {
        this.collectionService.subscriber$.subscribe({
            next: (data: { config: any }) => {
                this.loadingConfig = data.config.loadingConfig
                this.selectedElements = data.config.selection
            }
        })
    }

    fetchElements(fetchConfig: IFetchConfig = this.fetchConfig) {
        this.fetchConfig = fetchConfig

        if (this.selectedCollection) {
            this.collectionElementService
                .findMany(this.selectedCollection._id, fetchConfig)
                .subscribe({
                    next: (result: { elements: any[]; totalCount: number }) => {
                        this.loadingConfig.isLoadingData = false
                        this.collectionService.emitData({
                            config: {
                                selection: [],
                                loadingConfig: this.loadingConfig
                            }
                        })
                        this.fetchConfig.totalCount = result.totalCount
                        this.elements = result.elements
                    }
                })
        }
    }

    onSelectCollection(collection: any): void {
        this.selectedCollection = collection

        this.collectionConfig = this.collectionService.getCollectionConfig(collection)
        this.fields = this.collectionService.getFields(
            collection.viewOptions,
            this.collectionConfig.viewOption._id,
            'connectionElement'
        )

        this.state.isSelectCollection = false
        this.state.isSelectElements = true

        this.changeDetectorRef.detectChanges()
    }

    setFields() {
        this.fields = this.collectionService.getFields(
            this.selectedCollection.viewOptions,
            this.collectionConfig.viewOption._id,
            this.selectedFieldsType === 'initial' ? 'initialElement' : 'fields'
        )

        if (this.fields.length === 0 && this.selectedFieldsType === 'initialElement') {
            this.selectedFieldsType = 'all'
            this.fields = this.collectionService.getFields(
                this.selectedCollection.viewOptions,
                this.collectionConfig.viewOption._id
            )
        }
    }

    nextStep() {
        if (this.state.isSelectElements && this.selectedElements.length > 0) {
            this.close()
        }
    }

    settingFields() {
        const dialogRef: any = this.dialogService.open(ConnectElementFieldsComponent, {
            header: 'Setting connection fields',
            data: {
                viewOptions: this.selectedCollection.viewOptions,
                collectionConfig: this.collectionConfig
            }
        })

        dialogRef.onClose.subscribe({
            next: (data: { fields: any[] }) => {
                if (data) {
                    this.fields = data.fields
                    this.state.isUpdateFields = true
                }
            }
        })

        return dialogRef
    }

    close() {
        const selectedElementsIds = this.selectedElements.map((element: any) => {
            return { data: element._id }
        })

        this.selectedElements = []
        this.ref.close({
            selectedElements: selectedElementsIds,
            selectedCollection: this.selectedCollection,
            isUpdateFields: this.state.isUpdateFields,
            fields: this.fields
        })
    }
}
