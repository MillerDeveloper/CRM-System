import { CollectionService } from '@/shared/services/collection/collection.service'
import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-initial-element-fields',
    templateUrl: './initial-element-fields.component.html',
    styleUrls: ['./initial-element-fields.component.scss']
})
export class InitialElementFieldsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly collectionService: CollectionService,
        private readonly translateService: TranslateService
    ) {}

    initialFields: any[] = []
    fields: any[] = []
    viewOptionId!: string

    ngOnInit(): void {
        if (this.config?.data) {
            this.viewOptionId =
                this.config.data.collectionConfig.viewOption?._id ||
                this.config.data.collectionConfig?._id

            const fields = this.collectionService.getFields(
                this.config.data.viewOptions,
                this.viewOptionId
            )

            this.fields = [...fields]
            this.initialFields = this.collectionService.getFields(
                this.config.data.viewOptions,
                this.viewOptionId,
                'initialElement'
            )
        }
    }

    getFieldLabel(field: any) {
        return !!field.label ? field.label : this.translateService.instant('fields.' + field._id)
    }

    setFields() {
        const fields = this.collectionService.getFields(
            this.config.data.viewOptions,
            this.viewOptionId
        )

        this.initialFields.forEach((field: any) => {
            const index = fields.findIndex((fl: any) => {
                return fl._id === field._id
            })

            if (index !== -1) {
                fields[index].usage.element.onCreation = true
            }
        })

        this.ref.close({
            fields: fields
        })
    }
}
