import { StorageService } from '@/shared/services/storage/storage.service'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() onCreateTask: EventEmitter<any> = new EventEmitter()
    @Output() changeViewType: EventEmitter<any> = new EventEmitter()


    constructor(private readonly storageService: StorageService) {}
    selectedView: string = 'list'
    viewOptionsIcons: any[] = [
        { icon: 'pi pi-align-justify', viewType: 'list' },
        // { icon: 'pi pi-table', viewType: 'cards' },
        { icon: 'pi pi-ellipsis-v', viewType: 'kanban' }
    ]

    ngOnInit(): void {
        this.selectedView = this.storageService.getLsElement('task-view')?.viewType || 'list'
    }

    onChangeViewType(event: {value: string}) {
        this.changeViewType.emit(event.value)
    }
}
