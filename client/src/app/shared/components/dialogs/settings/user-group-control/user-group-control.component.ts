import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-user-group-control',
    templateUrl: './user-group-control.component.html',
    styleUrls: ['./user-group-control.component.scss']
})
export class UserGroupControlComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    stage: any = {
        isFilledFields: false,
        isFilledCollectionsRights: false,
        isFilledSystemRights: false
    }

    groupRights: any[] = []
    userGroupForm: FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
        description: new FormControl(null, [Validators.maxLength(1000)])
    })
    rights!: any

    ngOnInit(): void {
        if (this.config?.data && this.config.data.modalMode === 'update') {
            this.userGroupForm.patchValue(this.config.data.department)
            this.rights = this.config.data.department.rights
        }
    }

    nextStep() {
        if (!this.stage.isFilledFields) {
            this.stage.isFilledFields = true
        } else if (!this.stage.isFilledCollectionsRights) {
            this.stage.isFilledCollectionsRights = true
        } else if (!this.stage.isFilledSystemRights) {
            this.ref.close({
                data: {
                    ...this.userGroupForm.value,
                    rights: this.rights
                }
            })
        }
    }

    rightsChanged(event: { data: any }) {
        this.rights = event.data
    }
}
