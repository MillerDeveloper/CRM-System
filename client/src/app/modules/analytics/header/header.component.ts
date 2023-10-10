import { TranslateService } from '@ngx-translate/core'
import { Component, EventEmitter, Output, OnInit } from '@angular/core'
import * as moment from 'moment'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @Output() filter: EventEmitter<any> = new EventEmitter()

    constructor(private readonly translateService: TranslateService) {}

    rangeDates!: any
    selectedPeriod: string = 'halfYear'
    periods: any[] = []

    ngOnInit(): void {
        this.periods = [
            {
                label: this.translateService.instant('analytics.perYear'),
                value: 'year'
            },
            {
                label: this.translateService.instant('analytics.perHalfYear'),
                value: 'halfYear'
            },
            {
                label: this.translateService.instant('analytics.perMonth'),
                value: 'month'
            }
        ]
    }

    onFilter() {
        if (this.rangeDates[0] && this.rangeDates[1]) {
            this.filter.emit({
                createdAt: {
                    $gte: moment(this.rangeDates[0]).startOf('day').toDate(),
                    $lte: moment(this.rangeDates[1]).endOf('day').toDate()
                }
            })
        }
    }

    selectPeriod(event: { value: string }) {
        const today = moment().endOf('day').toDate()

        switch (event.value) {
            case 'year': {
                this.rangeDates = [moment().subtract(1, 'year').startOf('day').toDate(), today]
                break
            }
            case 'halfYear': {
                this.rangeDates = [moment().subtract(6, 'months').startOf('day').toDate(), today]
                break
            }
            case 'month': {
                this.rangeDates = [moment().subtract(1, 'month').startOf('day').toDate(), today]
                break
            }
        }

        this.onFilter()
    }
}
