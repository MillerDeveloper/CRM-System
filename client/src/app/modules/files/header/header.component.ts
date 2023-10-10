import { DialogService } from 'primeng/dynamicdialog'
import { StorageService } from '@/shared/services/storage/storage.service'
import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core'
import { MAX_FILE_SIZE } from '@globalShared/constants/system.constants'
import { CreateFolderComponent } from '@/shared/components/dialogs/create-folder/create-folder.component'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() config!: { currentPath: string; isConnectedFiles: boolean }
    @Output() viewOptionChanged: EventEmitter<any> = new EventEmitter()
    @Output() uploadFiles: EventEmitter<any> = new EventEmitter()
    @Output() closeFolder: EventEmitter<any> = new EventEmitter()
    @Output() onCreateFolder: EventEmitter<any> = new EventEmitter()

    constructor(private readonly storageService: StorageService) {}

    selectedViewOption!: string
    readonly maxFileSize: number = MAX_FILE_SIZE
    viewOptions: any[] = [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' }
    ]

    ngOnInit(): void {
        this.selectedViewOption =
            this.storageService.getStateElement('filesViewOption') ?? 'vertical'
    }

    onViewOptionChanged(option: { value: any }) {
        this.storageService.updateState('filesViewOption', option.value)
        this.viewOptionChanged.emit(option.value)
    }
}
