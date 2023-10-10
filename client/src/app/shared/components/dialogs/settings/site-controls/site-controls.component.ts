import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'
import { UserService } from '@/shared/services/user/user.service'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-site-controls',
    templateUrl: './site-controls.component.html',
    styleUrls: ['./site-controls.component.scss']
})
export class SiteControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly userService: UserService,
        private readonly collectionService: CollectionService,
        private readonly translateService: TranslateService
    ) {}

    methods: any[] = [
        {
            name: 'Random',
            value: 'random'
        },
        {
            name: 'Queue',
            value: 'queue'
        },
        {
            name: 'Workload',
            value: 'workload'
        }
    ]
    actions: any[] = [
        {
            name: 'Delete new',
            value: 'deleteNew'
        },
        {
            name: 'Delete Old',
            value: 'deleteOld'
        },
        {
            name: 'Merge',
            value: 'merge'
        },
        {
            name: 'Nothing',
            value: 'nothing'
        }
    ]
    filterValue: string = ''
    fields: any[] = []
    collections: any[] = []
    stage: any = {
        isFilledInfoFields: false
    }
    siteForm: FormGroup = new FormGroup({
        url: new FormControl(null, [Validators.required]),
        description: new FormControl(null),
        collectionRef: new FormControl(null),
        duplicates: new FormGroup({
            action: new FormControl('merge'),
            fields: new FormControl([])
        }),
        distribution: new FormGroup({
            method: new FormControl('queue'),
            users: new FormControl([])
        })
    })
    data: any = {
        users: []
    }

    ngOnInit(): void {
        this.data.users = this.userService.users?.map((user: any) => {
            return {
                coefficient: 100,
                data: user,
                lastRecordAt: new Date().toISOString()
            }
        })

        this.collectionService.findAll({}).subscribe({
            next: (response: { collections: any[] }) => {
                this.collections = response.collections
                this.siteForm.patchValue({
                    collectionRef: this.collections[0]
                })
            }
        })

        if (this.config.data?.mode === 'update') {
            this.siteForm.patchValue(this.config.data.site)
        }
    }

    nextStep() {
        if (!this.stage.isFilledInfoFields) {
            this.stage.isFilledInfoFields = true
            this.siteForm.get('distribution.method')?.setValidators([Validators.required])
            this.siteForm.get('distribution.users')?.setValidators([Validators.required])
        } else if (this.stage.isFilledInfoFields && !this.stage.isFilledDuplicateFields) {
            this.stage.isFilledDuplicateFields = true
        } else if (this.stage.isFilledDuplicateFields) {
            this.siteForm.get('collectionRef')?.setValidators([Validators.required])
            this.close()
        }
    }

    setFields() {
        this.fields = this.collectionService.getAllFields(
            this.siteForm.value.collectionRef.viewOptions
        )

        this.fields.forEach((field: any, index: number) => {
            this.fields[index].label = this.fields[index].label
                ? this.fields[index].label
                : this.translateService.instant('fields.' + field._id)
        })
    }

    close() {
        let data = this.siteForm.value
        data.collectionRef = data.collectionRef?._id
        this.ref.close({
            data: this.siteForm.value
        })
    }

    getMapedData(data: any[], key: string) {
        // return data.map((dt: any) => dt[key])
        console.log(data, key)
        return []
    }
}
