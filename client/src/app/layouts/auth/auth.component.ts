import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
    themeSeason!: string

    ngOnInit(): void {
        if (moment().month() === 12 || moment().month() <= 1) {
            this.themeSeason = 'winter'
        } else if (moment().month() >= 2 && moment().month() <= 5 ) {
            this.themeSeason = 'spring'
        }
    }
}
