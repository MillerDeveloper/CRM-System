import { Component, Output, EventEmitter } from '@angular/core'
import { ConfirmationService, MenuItem } from 'primeng/api'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Output() saveElement: EventEmitter<any> = new EventEmitter()
    @Output() delete: EventEmitter<any> = new EventEmitter()

    constructor(private readonly confirmationService: ConfirmationService) {}

    buttonHeaderModel: MenuItem[] = [
        { label: 'Delete', icon: 'pi pi-trash', command: () => this.onDeletion() }
    ]

    onDeletion() {
        this.confirmationService.confirm({
            message: 'Are you sure that you want delete this. record?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.delete.emit()
            }
        })
    }
}
