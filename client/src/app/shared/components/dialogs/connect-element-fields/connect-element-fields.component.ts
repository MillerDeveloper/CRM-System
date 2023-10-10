import { CollectionService } from '@/shared/services/collection/collection.service'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-connect-element-fields',
    templateUrl: './connect-element-fields.component.html',
    styleUrls: ['./connect-element-fields.component.scss']
})
export class ConnectElementFieldsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly collectionService: CollectionService
    ) {}

    connectionFields: any[] = []
    fields: any[] = []

    ngOnInit(): void {
        if (this.config.data) {
            const fields = this.collectionService.getFields(
                this.config.data.viewOptions,
                this.config.data.collectionConfig.viewOption._id
            )

            this.fields = [...fields]

            this.connectionFields = this.collectionService.getFields(
                this.config.data.viewOptions,
                this.config.data.collectionConfig.viewOption._id,
                'connectionElement'
            )

            this.connectionFields.forEach((connectionElementField: { _id: string }) => {
                const index = this.fields.findIndex(
                    (field: any) => field._id === connectionElementField._id
                )
                if (index !== -1) {
                    this.fields.splice(index, 1)
                }
            })
        }
    }

    setFields() {
        const fields = this.collectionService.getFields(
            this.config.data.viewOptions,
            this.config.data.collectionConfig.viewOption._id
        )

        this.connectionFields.forEach((field: any) => {
            const index = fields.findIndex((fl: any) => {
                return fl._id === field._id
            })
            if (index !== -1) {
                fields[index].usage.element.onConnection = true
            }
        })

        this.ref.close({
            fields: fields
        })
    }
}
