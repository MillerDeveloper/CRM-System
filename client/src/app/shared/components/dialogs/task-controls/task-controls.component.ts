import { TranslateService } from '@ngx-translate/core'
import { MenuItem } from 'primeng/api'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core'
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import * as moment from 'moment'
import { OverlayPanel } from 'primeng/overlaypanel'
import { UserService } from '@/shared/services/user/user.service'
import { ConnectToElementComponent } from '../connect-to-element/connect-to-element.component'
import { TaskService } from '@/shared/services/task/task.service'

interface ITaskDate {
    value: string
    icon: string
    endAt?: Date
}

@Component({
    selector: 'app-task-controls',
    templateUrl: './task-controls.component.html',
    styleUrls: ['./task-controls.component.scss']
})
export class TaskControlsComponent implements OnInit {
    @ViewChild('selectTaskDate', { static: false }) selectTaskDate!: OverlayPanel
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly userService: UserService,
        public readonly config: DynamicDialogConfig,
        public readonly taskService: TaskService,
        private readonly dialogService: DialogService,
        private readonly translateService: TranslateService
    ) {}

    modalMode!: string
    taskMenuModel: MenuItem[] = [
        {
            label: this.translateService.instant('global.createMore'),
            icon: 'pi pi-plus',
            command: () => {
                this.state.addMoreTasks = true
                this.nextStep()
            }
        }
    ]

    defaultDates: ITaskDate[] = [
        {
            value: 'today',
            icon: 'pi pi-calendar',
            endAt: moment().endOf('day').toDate()
        },
        {
            value: 'tomorrow',
            icon: 'pi pi-calendar-plus',
            endAt: moment().endOf('day').add(1, 'day').toDate()
        },
        {
            value: 'nextWeek',
            icon: 'pi pi-calendar-plus',
            endAt: moment().endOf('day').add(7, 'days').toDate()
        },
        {
            value: 'custom',
            icon: 'pi pi-calendar-times'
        },
        {
            value: 'nodate',
            icon: 'pi pi-ban'
        }
    ]
    state: any = {
        isPickCustomDate: false,
        addMoreTasks: false
    }
    users: any[] = []
    currentUser!: any
    selectedDate: ITaskDate = this.defaultDates[0]
    taskForm: FormGroup = new FormGroup({
        _id: new FormControl(null),
        title: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        startAt: new FormControl(null),
        endAt: new FormControl(null),
        period: new FormControl('today'),
        responsibles: new FormControl([], [Validators.required]),
        connections: new FormControl([])
    })

    ngOnInit(): void {
        if (this.config?.data) {
            this.modalMode = this.config.data.modalMode
            this.users = this.userService.users
            this.currentUser = this.userService.currentUser

            if (this.modalMode === 'create') {
                this.taskForm.patchValue({
                    responsibles: [this.userService.currentUser._id],
                    endAt: this.selectedDate.endAt
                })

                this.selectedDate = this.getTaskPeriodDate(this.config.data.period)
            } else {
                this.taskForm.patchValue(this.config.data.task)
                this.selectedDate = this.getTaskPeriodDate(this.config.data.task.period)
            }
        }
    }

    getTaskPeriodDate(period: string | number): any {
        const selectedDate: any = this.defaultDates.find((date: any) => date.value === period)

        if (selectedDate) {
            return selectedDate
        } else {
            return this.defaultDates[0]
        }
    }

    selectDate(event: any, date: ITaskDate | Date): void {
        if (date instanceof Date) {
            this.selectTaskDate.toggle(event)
            this.taskForm.patchValue({ endAt: date, period: 'custom' })
            setInterval(() => {
                this.state.isPickCustomDate = false
            }, 300)
        } else {
            if (date.endAt) {
                this.taskForm.patchValue({
                    endAt: date.endAt,
                    period: date.value
                })
                this.selectTaskDate.toggle(event)
            } else {
                switch (date.value) {
                    case 'custom': {
                        this.state.isPickCustomDate = true
                        this.taskForm.patchValue({ period: 'custom' })
                        break
                    }
                    case 'nodate': {
                        this.taskForm.patchValue({ endAt: null, period: 'nodate' })
                        this.selectTaskDate.toggle(event)
                        break
                    }
                }
            }

            this.selectedDate = date
        }
    }

    getCountConnectedElements(): number {
        return this.taskService.getCountConnectedElements(this.taskForm.value.connections)
    }

    onConnectToTask() {
        const dialogRef = this.dialogService.open(ConnectToElementComponent, {
            header: 'Connect to task',
            data: {
                showFieldSettings: false
            }
        })

        dialogRef.onClose.subscribe({
            next: (data: { selectedElements: [{ data: string }]; selectedCollection: any }) => {
                if (data) {
                    const connections = this.taskForm.value.connections

                    const collectionIndex = connections.findIndex(
                        (connection: any) =>
                            connection.collectionRef === data.selectedCollection._id
                    )

                    if (collectionIndex !== -1) {
                        this.taskForm.value.connections[collectionIndex].elements =
                            data.selectedElements
                    } else {
                        this.taskForm.value.connections.push({
                            collectionRef: data.selectedCollection._id,
                            elements: data.selectedElements
                        })
                    }
                }
            }
        })
    }

    nextStep() {
        const responsibles = this.taskForm.value.responsibles.map((responsible: any) => {
            return { data: responsible?.data || responsible }
        })

        this.taskForm.patchValue({ responsibles })
        this.ref.close({
            data: this.taskForm.value,
            addMoreTasks: this.state.addMoreTasks
        })
    }
}
