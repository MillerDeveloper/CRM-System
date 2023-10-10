import { SystemService } from '@/shared/services/system/system.service'
import { USERS_EVENTS } from './../../../../../../shared/constants/socket.constants'
import { TranslateService } from '@ngx-translate/core'
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { MenuItem } from 'primeng/api'
import { SocketService } from '@/shared/services/socket/socket.service'
import { UserService } from '@/shared/services/user/user.service'

@Component({
    selector: 'app-collection-header',
    templateUrl: './collection-header.component.html',
    styleUrls: ['./collection-header.component.scss']
})
export class CollectionHeaderComponent implements OnInit {
    @Input() config!: { collection: any }
    @Output() updateCollection: EventEmitter<any> = new EventEmitter()
    @Output() onDeleteCollection: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly translateService: TranslateService,
        public readonly userService: UserService,
        public readonly systemService: SystemService,
        private readonly socketService: SocketService
    ) {}

    isPickEmoji: boolean = false
    selectedEmoji: string = '😀'

    collectionSettingsMenu!: MenuItem[]
    activeUsers: any[] = []

    ngOnInit(): void {
        this.collectionSettingsMenu = [
            {
                label: this.translateService.instant('global.delete'),
                icon: 'pi pi-trash',
                command: () => {
                    this.onDeleteCollection.emit()
                }
            }
        ]

        this.socketService.on(USERS_EVENTS.usersUpdated, (response: { activeUsers: any[] }) => {
            this.activeUsers = []

            response.activeUsers.forEach((data: { userId: string }) => {
                const user = this.userService.getUserById(data.userId)
                if (user) {
                    this.activeUsers.push(user)
                }
            })
        })
    }

    selectEmoji(event: any) {
        this.isPickEmoji = false
        this.config.collection.label.icon = event.emoji.native
        this.updateCollection.emit(this.config.collection)
    }
}
