import { SocketService } from './../../shared/services/socket/socket.service'
import { NotificationService } from '@services/notification/notification.service'
import { StorageService } from '@services/storage/storage.service'
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core'
import { SwPush } from '@angular/service-worker'
import { vapidKeys } from '@globalShared/constants/system.constants'
import { LayoutService } from '@/shared/services/layout/layout.service'
import { SystemService } from '@/shared/services/system/system.service'
import { Router } from '@angular/router'
import { CHAT_EVENTS, USERS_EVENTS } from '@globalShared/constants/socket.constants'
import { UserService } from '@/shared/services/user/user.service'

@Component({
    selector: 'app-default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
    @ViewChild('sidebar') sidebar!: ElementRef<HTMLElement>

    constructor(
        private readonly storageService: StorageService,
        private readonly socketService: SocketService,
        private readonly swPush: SwPush,
        private readonly notificationService: NotificationService,
        public readonly layoutService: LayoutService,
        private readonly router: Router,
        private readonly userService: UserService,
        private readonly systemService: SystemService
    ) {}

    isClosedSidebar!: boolean

    ngOnInit(): void {
        this.isClosedSidebar = this.storageService.getStateElement('isClosedSidebar') ?? false

        if (this.layoutService.isSmaller('web')) {
            this.isClosedSidebar = true
            sessionStorage.setItem('layoutSizes', JSON.stringify([0, 100]))
        }

        this.requestSubscription()
        this.systemService.initActiveUsers()

        this.socketService.on(CHAT_EVENTS.newMessage, (data: { message: any }) => {
            if (
                (data.message.createdBy?._id || data.message.createdBy) !==
                this.userService.currentUser._id
            ) {
                const audio = new Audio()
                audio.src = '/assets/audio/notification.mp3'
                audio.load()
                audio.play()
            }
        })
    }

    requestSubscription() {
        if (!this.swPush.isEnabled) {
            console.info('Notification is not enabled.')
            return
        }

        this.swPush
            .requestSubscription({
                serverPublicKey: vapidKeys.public
            })
            .then((data: any) => {
                this.notificationService.subscribePushNotification(data).subscribe({
                    next: () => {}
                })
            })
            .catch((_) => console.log)
    }

    toggleSidebar() {
        this.isClosedSidebar = !this.isClosedSidebar
        this.storageService.updateState('isClosedSidebar', this.isClosedSidebar)
    }

    onResizeStart() {
        if (!this.layoutService.isSmaller('web')) {
            this.sidebar.nativeElement.style.width = '100%'
        }
    }

    onResizeEnd() {
        if (!this.layoutService.isSmaller('web')) {
            const sidebarWidth = this.sidebar.nativeElement.offsetWidth

            if (sidebarWidth >= 70 && this.isClosedSidebar) {
                this.isClosedSidebar = false
            } else if (sidebarWidth <= 180 && !this.isClosedSidebar) {
                this.isClosedSidebar = true
            }

            this.storageService.updateState('isClosedSidebar', this.isClosedSidebar)
        } else {
            this.isClosedSidebar = true
            sessionStorage.setItem('layoutSizes', JSON.stringify([0, 100]))
        }
    }

    ngOnDestroy(): void {
        this.socketService.emit(USERS_EVENTS.wentPage, {
            url: this.router.url
        })
    }
}
