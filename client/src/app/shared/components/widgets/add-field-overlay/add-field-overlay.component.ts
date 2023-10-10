import { TranslateService } from '@ngx-translate/core'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
    selector: 'app-add-field-overlay',
    templateUrl: './add-field-overlay.component.html',
    styleUrls: ['./add-field-overlay.component.scss']
})
export class AddFieldOverlayComponent implements OnInit {
    @Input() config!: { collection: any }
    @Output() onCreateField: EventEmitter<any> = new EventEmitter()
    @Output() addField: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly collectionService: CollectionService,
        private readonly translateService: TranslateService
    ) {}

    defaultFields: any[] = []
    collections: any[] = []
    fields: any[] = []

    ngOnInit(): void {
        if (this.config?.collection) {
            this.defaultFields = this.collectionService.getCollectionDefaultFields(
                this.config.collection
            )

            const collectionConfig = this.collectionService.getCollectionConfig(
                this.config.collection
            )
            this.fields = collectionConfig.viewOption.fields

            this.defaultFields = this.defaultFields.filter((field: any) => {
                const fld = !this.fields.find((fl: any) => fl._id === field._id)
                if (fld) {
                    if (!field.label) {
                        field.label =
                            this.translateService.instant(`fields.${field._id}`) || 'No name'
                    }
                }
                return !this.fields.find((fl: any) => fl._id === field._id)
            })

            this.fetchCollections()
        }
    }

    fetchCollections() {
        this.collectionService.findAll({}).subscribe({
            next: (response: { collections: any[] }) => {
                this.collections = response.collections
                this.collections = this.collections.filter((collection: any) => {
                    return !this.fields.find(
                        (field: any) => field.collectionRef?.data._id === collection._id
                    )
                })
            }
        })
    }
}
