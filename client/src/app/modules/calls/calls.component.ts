import { lastValueFrom } from 'rxjs'
import { CallService } from '@/shared/services/call/call.service'
import { FileService } from '@/shared/services/file/file.service'
import { UserService } from '@/shared/services/user/user.service'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import * as saveAs from 'file-saver'
import { Router } from '@angular/router'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'

@Component({
    selector: 'app-calls',
    templateUrl: './calls.component.html',
    styleUrls: ['./calls.component.scss']
})
export class CallsComponent implements OnInit {
    @Input() config!: { isConnectedCalls: boolean; collection: any; element: any }
    @Output() callCreated: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly callService: CallService,
        public readonly fileService: FileService,
        public readonly collectionElementService: CollectionElementService
    ) {}

    isConnectedCalls: boolean = false
    calls: any[] = []

    ngOnInit() {
        if (this.config?.isConnectedCalls) {
            this.isConnectedCalls = true
        }

        this.fetchElements()
    }

    fetchElements() {
        const filter: any = {}

        if (this.isConnectedCalls) {
            filter['connection.to'] = this.config.element._id
        }

        this.callService.findAll(filter).subscribe({
            next: (response: { calls: any[] }) => {
                this.calls = response.calls
            }
        })
    }

    downloadCallRecord(call: any) {
        this.fileService.downloadOne(call.recordRef).subscribe({
            next: (response: any) => {
                saveAs(response)
            }
        })
    }

    getCallRecord(call: any) {
        return lastValueFrom(this.fileService.downloadOne(call.recordRef))
    }
}
