import { CollectionService } from '@/shared/services/collection/collection.service'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog'
import { InitialElementFieldsComponent } from '../initial-element-fields/initial-element-fields.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-create-collection-element',
    templateUrl: './create-collection-element.component.html',
    styleUrls: ['./create-collection-element.component.scss']
})
export class CreateCollectionElementComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly dialogService: DialogService,
        private readonly collectionService: CollectionService,
        private readonly translateService: TranslateService
    ) {}

    initialFields: any[] = []
    fieldsConfig!: any
    state: any = {
        isUpdateCollecton: false
    }

    ngOnInit(): void {
        this.setView()
    }

    setView() {
        if (this.config.data?.collection) {
            this.initialFields = this.collectionService.getFields(
                this.config.data.collection.viewOptions,
                this.config.data.collectionConfig.viewOption._id,
                'initialElement'
            )

            const fields = this.collectionService.getFields(
                this.config.data.collection.viewOptions,
                this.config.data.collectionConfig.viewOption._id
            )

            this.fieldsConfig = {
                element: {
                    collectionRef: this.config.data.collection?._id
                }
            }

            fields.forEach((field: any) => {
                if (field.defaultValue) {
                    this.fieldsConfig.element[field._id] = field.defaultValue
                }
            })

            if (this.initialFields.length === 0) {
                const allFields = this.collectionService.getFields(
                    this.config.data.viewOptions,
                    this.config.data.collectionConfig.viewOption._id
                )

                if (allFields.length === 0) {
                    this.close()
                }
            }
        }
    }

    updateElement(event: { element: any; index: number }) {
        this.fieldsConfig.element = { ...this.fieldsConfig.element, ...event.element }
    }

    onSettingInitialFields() {
        const dialogRef = this.dialogService.open(InitialElementFieldsComponent, {
            header: this.translateService.instant('settings.initialFields'),
            data: {
                viewOptions: this.config.data.viewOptions,
                collectionConfig: this.config.data.collectionConfig
            }
        })

        dialogRef.onClose.subscribe({
            next: (data: { fields: any[] }) => {
                if (data) {
                    this.config.data.viewOptions = this.collectionService.setFields(
                        this.config.data.viewOptions,
                        this.config.data.collectionConfig.viewOption._id,
                        data.fields
                    )

                    this.setView()

                    this.config.data.collection.viewOptions = this.config.data.viewOptions
                    this.state.isUpdateCollecton = true
                }
            }
        })
    }

    close() {
        this.ref.close({
            data: this.fieldsConfig.element,
            isUpdateCollecton: this.state.isUpdateCollecton,
            collection: this.config.data.collection
        })
    }
}
