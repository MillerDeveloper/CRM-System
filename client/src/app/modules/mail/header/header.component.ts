import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Input() config!: { user: any; mail: any }
    @Output() onConnectMail: EventEmitter<any> = new EventEmitter()
    @Output() onSelectMail: EventEmitter<any> = new EventEmitter()
    @Output() onSendMail: EventEmitter<any> = new EventEmitter()
    @Output() onFilter: EventEmitter<any> = new EventEmitter()

    currentUser!: any
    labels: any[] = []
    filter: any = {
        labelIds: []
    }

    ngOnInit() {}

}
