import { LayoutService } from '@/shared/services/layout/layout.service'
import { UserService } from './../../shared/services/user/user.service'
import { CHAT_EVENTS } from '@globalShared/constants/socket.constants'
import { SocketService } from './../../shared/services/socket/socket.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { StorageService } from '@/shared/services/storage/storage.service'
import { ChatService } from './../../shared/services/chat/chat.service'
import { ChatControlsComponent } from './../../shared/components/dialogs/chat-controls/chat-controls.component'
import { DialogService } from 'primeng/dynamicdialog'
import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    Input,
    Output,
    EventEmitter
} from '@angular/core'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { SystemService } from '@/shared/services/system/system.service'

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
    @Input() config: { isConnectedChat: boolean; collection?: any; element?: any } = {
        isConnectedChat: false
    }
    @ViewChild('messagesContainer', { static: false }) private messagesContainerRef!: ElementRef
    @Output() chatCreated: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly dialogService: DialogService,
        private readonly storageService: StorageService,
        private readonly chatService: ChatService,
        private readonly socketService: SocketService,
        private readonly userService: UserService,
        public readonly layoutService: LayoutService,
        public readonly systemService: SystemService
    ) {}

    messageForm: FormGroup = new FormGroup({
        text: new FormControl(null, [Validators.required, Validators.maxLength(1000)])
    })
    chats: any[] = []
    messagesGroups: any[] = []
    isLastPage: boolean = false
    loadingConfig: ILoadingConfig = {
        isLoadingData: false,
        isFirstLoad: true
    }
    fetchConfig: any = {
        rows: 50,
        page: 0,
        sort: {
            createdAt: -1
        }
    }
    selectedChat!: any
    isScrolledToBottom: boolean = false

    ngOnInit(): void {
        this.fetchChats()

        this.socketService.on(CHAT_EVENTS.newMessage, () => {
            this.messagesGroups = []
            this.fetchMessages({ scrollToBottom: true })
        })
    }

    fetchChats() {
        this.loadingConfig.isLoadingData = true
        let filter: any = {}

        if (this.config?.isConnectedChat) {
            filter['connection.to'] = this.config.element._id
        } else {
            filter.mode = {
                $in: ['external', 'basic']
            }
        }

        this.chatService.findAll(filter).subscribe({
            next: (response: { chats: any[] }) => {
                this.chats = response.chats

                if (this.config?.isConnectedChat) {
                    if (this.chats.length > 0) {
                        this.selectChat(this.chats[0])
                    }
                } else {
                    const selectedChatId: string =
                        this.storageService.getStateElement('selectedChatId')

                    if (selectedChatId) {
                        const index = this.chats.findIndex(
                            (chat: any) => chat._id === selectedChatId
                        )

                        if (index !== -1) {
                            this.selectChat(this.chats[index])
                        }
                    }
                }

                this.loadingConfig.isLoadingData = false
                this.loadingConfig.isFirstLoad = false
            }
        })
    }

    fetchMessages(config: { scrollToBottom: boolean } = { scrollToBottom: false }) {
        if (this.selectedChat?._id) {
            this.loadingConfig.isLoadingData = true

            this.chatService.findAllMessages(this.selectedChat._id, this.fetchConfig).subscribe({
                next: (response: { messagesGroups: any[] }) => {
                    if (response.messagesGroups.length === 0) {
                        this.isLastPage = true
                    } else {
                        this.concatMessages(response.messagesGroups)
                    }

                    this.loadingConfig.isLoadingData = false
                    this.loadingConfig.isFirstLoad = false

                    if (config.scrollToBottom) {
                        this.scrollToBottom()
                    }
                }
            })
        }
    }

    concatMessages(messagesGroups: any[]) {
        messagesGroups.forEach((group: { period: any; messages: any[] }) => {
            const index = this.messagesGroups.findIndex((e: any) => {
                return e.period.identifier === group.period.identifier
            })

            if (index !== -1) {
                this.messagesGroups[index].messages = [
                    ...group.messages,
                    ...this.messagesGroups[index].messages
                ]
            } else {
                this.messagesGroups.unshift(group)
            }
        })
    }

    onFetchMessages() {
        if (!this.loadingConfig.isLoadingData && !this.isLastPage) {
            this.fetchConfig.page += 1
            this.fetchMessages()
        }
    }

    onScrollToBottom(): boolean {
        if (!this.isScrolledToBottom) {
            this.scrollToBottom()
        }

        return true
    }

    scrollToBottom() {
        if (this.messagesContainerRef) {
            try {
                this.messagesContainerRef.nativeElement.scrollTop =
                    this.messagesContainerRef.nativeElement.scrollHeight

                this.isScrolledToBottom = true
            } catch (error) {
                console.error(error)
            }
        }
    }

    onCreateChat() {
        if (this.config?.isConnectedChat) {
            const data = {
                mode: 'connected',
                chatType: 'single',
                connection: {
                    to: this.config.element._id,
                    model: 'CollectionElement',
                    collectionRef: this.config.collection?._id
                }
            }

            this.createChat(data)
        } else {
            const dialogRef = this.dialogService.open(ChatControlsComponent, {
                header: 'Create chat'
            })

            dialogRef.onClose.subscribe({
                next: (result: { data: any }) => {
                    if (result) {
                        this.createChat(result.data)
                    }
                }
            })
        }
    }

    createChat(data: any) {
        this.chatService.createChat(data).subscribe({
            next: (response: { chat: any }) => {
                this.chatCreated.emit(response.chat)
                this.fetchChats()
            }
        })
    }

    selectChat(chat: any) {
        this.messagesGroups = []
        this.selectedChat = chat
        this.storageService.updateState('selectedChatId', chat._id)
        this.fetchMessages()
    }

    sendMessage() {
        this.socketService.emit(CHAT_EVENTS.sendMessage, {
            ...this.messageForm.value,
            chatRef: this.selectedChat._id
        })
        this.messageForm.reset()
        this.isScrolledToBottom = false
    }

    onMessagesScroll(event: any) {
        if (this.messagesContainerRef.nativeElement.scrollTop <= 200) {
            this.onFetchMessages()
        }
    }

    getChatLabel(chat: any) {
        if (chat.createdBy.data._id === this.userService.currentUser._id) {
            return chat.chatWith[0].data?.name.full
        } else {
            return chat.createdBy?.name.full
        }
    }
}
