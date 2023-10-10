import { SystemService } from '@/shared/services/system/system.service'
import { UserService } from '@/shared/services/user/user.service'
import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-responsibles-group',
    templateUrl: './responsibles-group.component.html',
    styleUrls: ['./responsibles-group.component.scss']
})
export class ResponsiblesGroupComponent implements OnInit {
    @Input() config!: { responsibles: any[]; mapBy: string }

    constructor(
        private readonly userService: UserService,
        public readonly systemService: SystemService
    ) {}

    ngOnInit(): void {
        if (!Array.isArray(this.config?.responsibles)) {
            this.config.responsibles = []
        }

        if (this.config.mapBy) {
            this.config.responsibles = this.config.responsibles.map(
                (data: any) => data[this.config.mapBy]
            )
        }

        this.config.responsibles = this.config.responsibles.map((responsible: any) => {
            if (typeof responsible?.data === 'string') {
                return this.userService.getUserById(responsible.data)
            }

            return responsible
        })
    }

    getLastAvatar() {
        return (this.config.responsibles.length - 3).toString()
    }
}
