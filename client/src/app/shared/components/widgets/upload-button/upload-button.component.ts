import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { MAX_FILE_SIZE } from '@globalShared/constants/system.constants'
import { FileUpload } from 'primeng/fileupload'

@Component({
    selector: 'app-upload-button',
    templateUrl: './upload-button.component.html',
    styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
    @Input() config: {
        multiple: boolean
        setFormData: boolean
        accept?: string
        disabled?: boolean
    } = {
        multiple: true,
        setFormData: true,
        disabled: false
    }
    @ViewChild('fileUpload') fileUploadRef!: FileUpload
    @Output() uploadFiles: EventEmitter<any> = new EventEmitter()
    readonly maxFileSize: number = MAX_FILE_SIZE

    uploadHandler(event: any) {
        if (this.config.setFormData) {
            const formData = new FormData()
            event.files.forEach((file: File) => {
                formData.append('file', file, file.name)
            })

            this.uploadFiles.emit(formData)
        } else {
            if (this.config.multiple) {
                this.uploadFiles.emit(event.files)
            } else {
                this.uploadFiles.emit(event.files[0])
            }
        }

        this.fileUploadRef.clear()
    }
}
