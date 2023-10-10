import {TranslateModule} from '@ngx-translate/core'
import { UploadButtonModule } from './../../shared/components/widgets/upload-button/upload-button.module'
import { DividerModule } from 'primeng/divider'
import { ContextMenuModule } from 'primeng/contextmenu'
import { DragDropModule } from 'primeng/dragdrop'
import { ButtonModule } from 'primeng/button'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { FilesRoutingModule } from './files-routing.module'
import { FilesComponent } from './files.component'
import { HeaderComponent } from './header/header.component'
import { TreeModule } from 'primeng/tree'
import { FormsModule } from '@angular/forms'
import { TreeDragDropService } from 'primeng/api'
import { SelectButtonModule } from 'primeng/selectbutton'
import { ProgressBarModule } from 'primeng/progressbar'
import { MenuModule } from 'primeng/menu'
import { CreateFolderModule } from '@/shared/components/dialogs/create-folder/create-folder.module'

@NgModule({
    declarations: [FilesComponent, HeaderComponent],
    imports: [
        CommonModule,
        FilesRoutingModule,
        ButtonModule,
        TreeModule,
        DragDropModule,
        FormsModule,
        ContextMenuModule,
        SelectButtonModule,
        ProgressBarModule,
        DividerModule,
        MenuModule,
        UploadButtonModule,
        CreateFolderModule,
        TranslateModule
    ],
    exports: [FilesComponent],
    providers: [TreeDragDropService]
})
export class FilesModule {}
