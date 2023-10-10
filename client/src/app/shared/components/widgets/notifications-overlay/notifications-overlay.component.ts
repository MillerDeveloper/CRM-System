import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { nameFromSchemaName } from '@globalShared/utils/system.utils'

@Component({
    selector: 'app-notifications-overlay',
    templateUrl: './notifications-overlay.component.html',
    styleUrls: ['./notifications-overlay.component.scss']
})
export class NotificationsOverlayComponent implements OnInit {
    @Input() config: { notifications: any[] } = {
        notifications: []
    }
    @Output() deleteNotification: EventEmitter<any> = new EventEmitter()

    constructor(private readonly router: Router) {}

    ngOnInit() {}

    openCard(notification: any) {
        switch (notification.connection.model) {
            case 'Task': {
                this.router.navigate(['tasks'])
                break
            }
            default: {
                this.router.navigate([
                    nameFromSchemaName(notification.connection.model),
                    notification.connection?.to._id
                ])
            }
        }
    }
}
