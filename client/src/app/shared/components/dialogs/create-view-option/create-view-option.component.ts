import { Component } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-create-view-option',
    templateUrl: './create-view-option.component.html',
    styleUrls: ['./create-view-option.component.scss']
})
export class CreateViewOptionComponent {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    viewForm: FormGroup = new FormGroup({
        label: new FormControl(null, Validators.required)
    })

    state = {
        viewType: ''
    }

    create() {
        this.ref.close({
            data: { ...this.viewForm.value, viewType: this.state.viewType }
        })
    }
}
