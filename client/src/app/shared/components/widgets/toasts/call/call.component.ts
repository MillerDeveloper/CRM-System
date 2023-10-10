import { BinotelService } from './../../../../services/telephony/binotel/binotel.service'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { SocketService } from '@/shared/services/socket/socket.service'
import { UserService } from '@/shared/services/user/user.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { BINOTEL_EVENTS } from '@globalShared/constants/socket.constants'
import { MessageService } from 'primeng/api'

@Component({
    selector: 'app-call',
    templateUrl: './call.component.html',
    styleUrls: ['./call.component.scss'],
    providers: [MessageService]
})
export class CallComponent implements OnInit {
    constructor(
        private readonly messageService: MessageService,
        private readonly userService: UserService,
        private readonly socketService: SocketService,
        private readonly router: Router,
        private readonly binotelService: BinotelService,
        private readonly collectionElementService: CollectionElementService
    ) {}

    element: any = null
    callStage: string = 'calling'
    generalCallID!: string
    callStatus!: string
    collection: any = null

    ngOnInit(): void {
        if (this.callStage !== 'answered') {
            this.socketService.on(BINOTEL_EVENTS.callStart, (event: any) => {
                this.generalCallID = event.generalCallID
                this.collectionElementService
                    .findInAllCollections(
                        { ['phone.value']: event.externalNumber },
                        { method: 'findOne' }
                    )
                    .subscribe({
                        next: (response: { element: any; collection: any }) => {
                            if (response.element) {
                                const index = response.element.responsibles.findIndex(
                                    (user: any) =>
                                        (user.data?._id || user.data) ===
                                        this.userService.currentUser._id
                                )

                                if (index !== -1) {
                                    this.element = response.element
                                    this.collection = response.collection
                                }
                            }

                            this.showCall(event.externalNumber)
                        },
                        error: () => {
                            this.showCall(event.externalNumber)
                            this.callStage === 'calling'
                            this.element = null
                        }
                    })
            })
        }

        this.socketService.on(BINOTEL_EVENTS.callAnswer, (event: any) => {
            this.callStage = 'answered'
        })

        this.socketService.on(BINOTEL_EVENTS.callStop, (event: any) => {
            this.callStage = 'hungUp'
            this.callStatus = event.disposition

            setTimeout(() => {
                this.fetchCallRecord()
                this.onReject()
            }, 2500)
        })
    }

    showCall(detail: string) {
        this.messageService.add({
            key: 'callToast',
            sticky: true,
            severity: 'call',
            summary: this.element ? `Call with ${this.element.name?.value}` : 'New contact',
            detail: detail
        })
    }

    hangUp() {
        this.binotelService.hangUp(this.generalCallID).subscribe({})
    }

    onReject() {
        this.messageService.clear('callToast')
        this.hangUp()
    }

    onConfirm() {
        if (this.element) {
            this.router.navigate(['collection', this.collection._id, this.element._id])
        } else {
        }
    }

    fetchCallRecord() {
        const callStatus = this.getCallStatus()

        if (callStatus !== 'canceled') {
            this.binotelService.getCallDetails(this.generalCallID).subscribe({
                next: ({ response }) => {
                    if (response.recordingStatus === 'uploaded') {
                        this.binotelService
                            .setCallRecord(this.generalCallID, {
                                connection: {
                                    to: this.element._id,
                                    model: 'CollectionElement',
                                    collectionRef: this.collection._id
                                },
                                duration: response.billsec,
                                status: this.getCallStatus(),
                                responseTime: response.waitsec,
                                callType: response.callType === 1 ? 'outcome' : 'income'
                            })
                            .subscribe({
                                next: ({ response }) => {}
                            })
                    } else {
                        setTimeout(() => {
                            this.fetchCallRecord()
                        }, 10000)
                    }
                }
            })
        }
    }

    getCallStatus() {
        switch (this.callStatus) {
            case 'ANSWER': {
                return 'answered'
            }
            case 'CANSEL': {
                return 'canceled'
            }
            default: {
                return 'canceled'
            }
        }
    }
}
