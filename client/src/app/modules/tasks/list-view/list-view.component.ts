import { Component, EventEmitter, Input, Output } from '@angular/core'
import { ITaskViewConfig } from '../tasks.component'
import * as moment from 'moment'
import { TranslateService } from '@ngx-translate/core'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { Router } from '@angular/router'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
    @Input() config!: ITaskViewConfig
    @Output() onCreateTask: EventEmitter<any> = new EventEmitter()
    @Output() openCard: EventEmitter<any> = new EventEmitter()
    @Output() updateTask: EventEmitter<any> = new EventEmitter()
    @Output() onUpdateTask: EventEmitter<any> = new EventEmitter()
    @Output() onDeleteTask: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly translateService: TranslateService,
        public readonly collectionElementService: CollectionElementService,
        private readonly router: Router
    ) {}

    today: Date = new Date()
    selectedTask!: any
    selectedTaskData!: any
    isCompletedTasksOpen: boolean = false
    taskSettingsMenu: MenuItem[] = [
        {
            label: this.translateService.instant('global.update'),
            icon: 'pi pi-cog',
            command: () => this.onUpdateTask.emit(this.selectedTask)
        },
        {
            label: this.translateService.instant('global.delete'),
            icon: 'pi pi-trash',
            command: () => this.onDeleteTask.emit(this.selectedTask)
        }
    ]

    getTaskPeriodLabel(period: string | number) {
        if (typeof period === 'number') {
            return moment().set('month', period).format('MMMM')
        } else {
            switch (period) {
                case 'today':
                    return this.translateService.instant('tasks.today')
                case 'tomorrow':
                    return this.translateService.instant('tasks.tomorrow')
                case 'nextweek':
                    return this.translateService.instant('tasks.nextweek')
                case 'completed':
                    return this.translateService.instant('tasks.completed')
                default:
                    return period
            }
        }
    }

    isCustomPeriod(period: string | number): boolean {
        return typeof period === 'number'
    }

    completeTask(dataIndex: number, taskIndex: number) {
        this.config.elements[dataIndex].tasks[taskIndex].stage.progress = 'completed'
        this.config.elements[dataIndex].tasks[taskIndex].stage.completedAt = moment().toDate()
        this.updateTask.emit(this.config.elements[dataIndex].tasks[taskIndex])
    }

    getDaysFromToday(date: Date) {
        return moment(date).fromNow()
    }

    isTaskOverdue(date: Date): boolean {
        return moment().isAfter(date)
    }

    openElemCard(connection: any, connectionElement: any) {
        this.router.navigate([
            'collection',
            connection.collectionRef._id,
            connectionElement.data._id
        ])
    }
}
