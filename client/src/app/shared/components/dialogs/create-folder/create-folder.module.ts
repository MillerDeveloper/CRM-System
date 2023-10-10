import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { UploadButtonModule } from './../../widgets/upload-button/upload-button.module'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CreateFolderComponent } from './create-folder.component'

@NgModule({
    declarations: [CreateFolderComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UploadButtonModule,
        ButtonModule,
        InputTextModule,
        FormsModule
    ],
    exports: [CreateFolderComponent]
})
export class CreateFolderModule {}
