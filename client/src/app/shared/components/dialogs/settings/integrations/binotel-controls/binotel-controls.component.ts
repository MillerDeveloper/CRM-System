import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-binotel-controls',
    templateUrl: './binotel-controls.component.html',
    styleUrls: ['./binotel-controls.component.scss']
})
export class BinotelControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    binotelForm: FormGroup = new FormGroup({
        key: new FormControl(null, Validators.required),
        secret: new FormControl(null, Validators.required),
        companyId: new FormControl(null, Validators.required),
        callNumberType: new FormControl(null, Validators.required)
    })

    callNumberTypes: any[] = [
        {
            name: 'Internal number',
            value: 'internal'
        },
        {
            name: 'External number',
            value: 'external'
        }
    ]

    ngOnInit(): void {
        if (this.config.data?.info) {
            this.binotelForm.patchValue(this.config.data?.info)
        }
    }

    close() {
        this.ref.close({
            data: this.binotelForm.value
        })
    }
}
