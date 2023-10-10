import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-create-folder',
    templateUrl: './create-folder.component.html',
    styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig
    ) {}

    folderForm: FormGroup = new FormGroup({
        name: new FormControl(null, [Validators.required, Validators.maxLength(200)])
    })

    stage: any = {
        isUploadFile: false
    }

    nextStep() {
        if (!this.stage.isUploadFile) {
            this.stage.isUploadFile = true
        }
    }

    uploadFiles(formData: FormData) {
        this.close({
            formData: formData,
            form: this.folderForm.value
        })
    }

    close(data: any) {
        this.ref.close(data)
    }
}
