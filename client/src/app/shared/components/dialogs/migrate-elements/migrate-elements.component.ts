import { CollectionService } from './../../../services/collection/collection.service'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-migrate-elements',
    templateUrl: './migrate-elements.component.html',
    styleUrls: ['./migrate-elements.component.scss']
})
export class MigrateElementsComponent implements OnInit {
    collections: any[] = []
    selectedCollection!: any

    constructor(
        private readonly collectionService: CollectionService,
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    ngOnInit() {
        this.collectionService.findAll({}).subscribe({
            next: (response: { collections: any[] }) => {
                this.collections = response.collections
            }
        })
    }

    close() {
        this.ref.close({
            collection: this.selectedCollection
        })
    }
}
