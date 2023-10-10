import { ILoadingConfig } from './../../../shared/interfaces/global.interface'
import { MailService } from '@/shared/services/mail/mail.service'
import { Component, HostListener, OnInit, ViewChild, ElementRef, Input } from '@angular/core'
import { SystemService } from '@/shared/services/system/system.service'
import { DomSanitizer } from '@angular/platform-browser'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-gmail',
    templateUrl: './gmail.component.html',
    styleUrls: ['./gmail.component.scss']
})
export class GmailComponent implements OnInit {
    @HostListener('mousewheel', ['$event'])
    onScroll(e: any) {
        if (!this.loadingConfig.isLoadingData) {
            this.fetchMessages()
        }
    }

    @Input() config!: { mail: any }

    constructor(
        private readonly mailService: MailService,
        public readonly systemService: SystemService,
        public readonly domSanitizer: DomSanitizer,
        private readonly messageService: MessageService
    ) {}

    notAvaibleLabels: any[] = ['CHAT', 'DRAFT']
    messages: any[] = []
    isOpenSidebar: boolean = false
    selectedMessage!: any
    labels: any[] = []

    fetchConfig: any = {
        limit: 5,
        search: '',
        labelIds: []
    }
    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }

    ngOnInit(): void {
        if (this.config?.mail) {
            this.fetchMessages()
        }
    }

    fetchMessages() {
        this.loadingConfig.isLoadingData = true
        this.mailService
            .findAll(this.fetchConfig, { service: 'gmail', email: this.config.mail.email })
            .subscribe({
                next: (response: {
                    messages: any[]
                    data: { nextPageToken: string }
                    labels: any[]
                }) => {
                    this.messages = this.messages.concat(response.messages)
                    this.fetchConfig.nextPageToken = response.data.nextPageToken
                    this.labels = response.labels.filter(
                        (label: any) => !this.notAvaibleLabels.includes(label.id)
                    )
                    console.log(this.labels)

                    this.loadingConfig.isLoadingData = false
                }
            })
    }

    openMessage(message: any) {
        if (message.textHtml) {
            this.selectedMessage = message
            this.isOpenSidebar = true
        }
    }

    onPageScroll(event: any) {
        console.log(event)
    }

    updateOne(event: any, message: any) {
        const addLabelIds = event.filter((labelId: string) => !message.labelIds.includes(labelId))
        const removeLabelIds = message.labelIds.filter(
            (labelId: string) => !event.includes(labelId)
        )

        this.mailService
            .updateOne(
                {
                    id: message.id,
                    addLabelIds: addLabelIds,
                    removeLabelIds: removeLabelIds
                },
                {
                    service: 'gmail',
                    email: this.config.mail.email
                }
            )
            .subscribe({
                // error: (error: any) => {
                //     this.messageService.add({
                //         severity: 'Update error',
                //         detail: error.error.message
                //     })
                // }
            })
    }

    onFilter(filter: any) {
        this.fetchConfig.labelIds = filter.labelIds || []
        this.fetchConfig.search = filter.search || ''
        this.messages = []

        this.fetchMessages()
    }
}
