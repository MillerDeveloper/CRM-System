import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
    @Input() config!: { labels: any }
    @Output() onFilter: EventEmitter<any> = new EventEmitter()

    filter: any = {
        labelIds: []
    }
    searchTimeout!: any

    ngOnInit(): void {}

    onSearch(event: any) {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            if (event && event.length > 2) {
                this.filter.search = event
            } else {
                delete this.filter.search
            }

            this.onFilter.emit(this.filter)
        }, 600)
    }
}
