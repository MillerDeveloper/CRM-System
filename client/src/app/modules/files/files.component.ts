import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '@/shared/services/storage/storage.service'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { FileService } from '@/shared/services/file/file.service'
import { saveAs } from 'file-saver'
import { CreateFolderComponent } from '@/shared/components/dialogs/create-folder/create-folder.component'
import { DialogService } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {
    @Input() config!: { isConnectedFiles: boolean; collection?: any; element: any }
    @Output() fileCreated: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly storageService: StorageService,
        private readonly fileService: FileService,
        private readonly dialogService: DialogService,
        private readonly translateService: TranslateService
    ) {}

    folders: any[] = []
    files: any[] = []
    selectedFile!: any
    isConnectedFiles: boolean = false
    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }
    selectedViewOption!: string
    currentPath: string = ''
    fileMenuModel: MenuItem[] = []
    filesContextMenuModel: MenuItem[] = [
        {
            label: 'Download',
            icon: 'pi pi-cloud-download'
        },
        {
            label: 'Create folder',
            icon: 'pi pi-folder'
        }
    ]

    ngOnInit(): void {
        this.fileMenuModel = [
            {
                label: this.translateService.instant('global.delete'),
                icon: 'pi pi-trash',
                command: () => {
                    this.deleteFile()
                }
            },
            {
                label: this.translateService.instant('global.download'),
                icon: 'pi pi-download',
                command: () => {
                    this.downloadFile()
                }
            }
        ]

        this.selectedViewOption =
            this.storageService.getStateElement('filesViewOption') ?? 'vertical'

        this.isConnectedFiles = this.config?.isConnectedFiles
        this.fetchElements()
    }

    fetchElements() {
        this.loadingConfig.isLoadingData = true
        console.log({
            ['metadata.path']: this.currentPath,
            ['metadata.connection.to']: this.config?.element?._id ?? null
        })

        this.fileService
            .findMany({
                ['metadata.path']: this.currentPath,
                ['metadata.connection.to']: this.config?.element?._id ?? null
            })
            .subscribe({
                next: (response: { files: any[]; folders: any[] }) => {
                    this.folders = response.folders
                    this.files = response.files

                    if (
                        this.files.length === 0 &&
                        this.folders.length === 0 &&
                        this.currentPath !== ''
                    ) {
                        this.closeFolder()
                    }

                    this.loadingConfig.isLoadingData = false
                }
            })
    }

    uploadFiles(formData: FormData) {
        this.loadingConfig.isLoadingData = true
        this.fileService
            .upload(formData, { currentPath: this.currentPath, id: this.config?.element?._id })
            .subscribe({
                next: (response: { files: any }) => {
                    this.fileCreated.emit(response.files)
                    this.fetchElements()
                }
            })
    }

    downloadFile() {
        this.fileService.downloadOne(this.selectedFile._id).subscribe({
            next: (response: any) => {
                saveAs(response, this.selectedFile.filename)
            }
        })
    }

    deleteFile() {
        this.fileService.deleteOne(this.selectedFile._id).subscribe({
            next: () => {
                this.fetchElements()
            }
        })
    }

    viewOptionChanged(viewOption: string): void {
        this.selectedViewOption = viewOption
    }

    openFolder(folder: any) {
        this.currentPath = folder.path
        this.fetchElements()
    }

    closeFolder() {
        const currentSplitedPath = this.currentPath.split('/')
        currentSplitedPath.pop()
        this.currentPath = currentSplitedPath.join('/')
        this.fetchElements()
    }

    onCreateFolder() {
        const dialogRef = this.dialogService.open(CreateFolderComponent, {
            header: 'Create folder',
            data: {}
        })

        dialogRef.onClose.subscribe({
            next: (result: { form: any; formData: FormData }) => {
                this.currentPath = result.form.name
                this.uploadFiles(result.formData)
            }
        })
    }
}
