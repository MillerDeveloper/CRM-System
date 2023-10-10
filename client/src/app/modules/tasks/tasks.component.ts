import { Subscription } from 'rxjs'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { TaskControlsComponent } from './../../shared/components/dialogs/task-controls/task-controls.component'
import { DialogService } from 'primeng/dynamicdialog'
import { ConfirmationService, MenuItem } from 'primeng/api'
import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    OnDestroy,
    ChangeDetectorRef
} from '@angular/core'
import { TaskService } from '@/shared/services/task/task.service'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import * as moment from 'moment'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { Router } from '@angular/router'
import { OverlayPanel } from 'primeng/overlaypanel'
import { UserService } from '@/shared/services/user/user.service'
import { StorageService } from '@/shared/services/storage/storage.service'

interface ITaskPeriod {
    period: string | number
    tasks: any[]
}

export interface ITaskViewConfig {
    elements: any[]
    isConnectedTasks: boolean
}

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    providers: [ConfirmationService]
})
export class TasksComponent implements OnInit, OnDestroy {
    @ViewChild('opAddCheckbox') addCheckboxRef!: OverlayPanel
    @ViewChild('opAddChecklist') addChecklistRef!: OverlayPanel
    @Input() config!: { isConnectedTasks: boolean; collection: any; element: any }
    @Output() taskCreated: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly dialogService: DialogService,
        public readonly taskService: TaskService,
        private readonly router: Router,
        public readonly collectionElementService: CollectionElementService,
        private readonly translateService: TranslateService,
        public readonly userService: UserService,
        private readonly confirmationService: ConfirmationService,
        private readonly storageService: StorageService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    subscription: Subscription = new Subscription()
    isConnectedTasks: boolean = false
    tasks: ITaskPeriod[] = []
    selectedTask!: any
    selectedTaskData!: any
    selectedView: string = 'list'
    isOpenedCard: boolean = false
    fieldTimeout!: any
    taskCardModel: MenuItem[] = [
        {
            label: this.translateService.instant('global.delete'),
            icon: 'pi pi-trash',
            command: () => {
                this.onDeleteTask()
            }
        }
    ]
    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }
    taskData: any = {
        title: '',
        description: '',
        users: []
    }
    taskOptions: any[] = [
        { label: 'Start', value: 'started' },
        { label: 'Complete', value: 'completed' }
    ]

    runningTaskOptions: any[] = [
        { label: 'Pause', value: 'paused' },
        { label: 'Complete', value: 'completed' }
    ]

    taskForm: FormGroup = new FormGroup({
        _id: new FormControl(null),
        title: new FormControl(null, [Validators.required, Validators.maxLength(1000)]),
        description: new FormControl(null, [Validators.required, Validators.maxLength(5000)]),
        startAt: new FormControl(null),
        endAt: new FormControl(null),
        createdAt: new FormControl(null),
        period: new FormControl('today'),
        responsibles: new FormControl([], [Validators.required]),
        connections: new FormControl([])
    })
    selectedChecklistIndex!: number

    ngOnInit(): void {
        if (this.config?.isConnectedTasks) {
            this.isConnectedTasks = true
        }

        this.selectedView = this.storageService.getLsElement('task-view')?.viewType
        this.fetchElements()
    }

    fetchElements() {
        this.loadingConfig.isLoadingData = true
        const filter: any = {}

        if (this.isConnectedTasks) {
            filter['connections.elements.data'] = this.config.element._id
        }

        this.subscription.add(
            this.taskService.findAll(filter).subscribe({
                next: (result: { tasks: any[] }) => {
                    this.tasks = result.tasks
                    this.loadingConfig.isLoadingData = false
                }
            })
        )
    }

    isCustomPeriod(period: string | number): boolean {
        return typeof period === 'number'
    }

    onCreateTask(period: string | number = 'today'): void {
        if (this.isCustomPeriod(period)) {
            period = 'today'
        }

        this.subscription.add(
            this.openTaskModal({
                modalMode: 'create',
                header: this.translateService.instant('tasks.create'),
                period: period,
                isConnectedTasks: this.isConnectedTasks
            }).onClose.subscribe({
                next: (result: { data: any; addMoreTasks: boolean }) => {
                    if (result) {
                        if (result.addMoreTasks) {
                            this.onCreateTask(period)
                        }

                        const data = result.data

                        if (this.isConnectedTasks) {
                            const newConnection = {
                                collectionRef: this.config.collection._id,
                                elements: [
                                    {
                                        data: this.config.element._id
                                    }
                                ]
                            }
                            if (Array.isArray(data.connections)) {
                                data.connections.push(newConnection)
                            } else {
                                data.connections = [newConnection]
                            }
                        }

                        this.taskService.create(data).subscribe({
                            next: (result: { task: any }) => {
                                this.tasks.push(result.task)
                                this.taskCreated.emit(result.task)
                                this.fetchElements()
                            }
                        })
                    }
                }
            })
        )
    }

    onUpdateTask(selectedTask: any) {
        this.subscription.add(
            this.openTaskModal({
                modalMode: 'update',
                header: 'Update task',
                task: selectedTask
            }).onClose.subscribe({
                next: (result: { data: any }) => {
                    if (result) {
                        this.taskService.update(result.data).subscribe({
                            next: () => {
                                this.fetchElements()
                            }
                        })
                    }
                }
            })
        )
    }

    updateTask(task: any): void {
        this.subscription.add(
            this.taskService.update(task).subscribe({
                next: (result: { task: any }) => {
                    this.fetchElements()
                }
            })
        )
    }

    onDeleteTask(selectedTask: any = this.selectedTask) {
        if (selectedTask) {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to delete?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.deleteTask(selectedTask)
                }
            })
        }
    }

    deleteTask(selectedTask: any) {
        this.subscription.add(
            this.taskService.deleteOne(selectedTask._id).subscribe({
                next: () => {
                    this.fetchElements()
                }
            })
        )
    }

    isTaskOverdue(date: Date): boolean {
        return moment().isAfter(date)
    }

    getDaysFromToday(date: Date) {
        return moment(date).fromNow()
    }

    openElemCard(connection: any, connectionElement: any) {
        this.router.navigate([
            'collection',
            connection.collectionRef._id,
            connectionElement.data._id
        ])
    }

    openTaskModal(data: {
        modalMode: string
        header: string
        period?: string | number
        task?: any
        isConnectedTasks?: boolean
    }) {
        return this.dialogService.open(TaskControlsComponent, {
            header: data.header,
            data
        })
    }

    completeTask(dataIndex: number, taskIndex: number) {
        this.tasks[dataIndex].tasks[taskIndex].stage.progress = 'completed'
        this.tasks[dataIndex].tasks[taskIndex].stage.completedAt = moment().toDate()
        this.updateTask(this.tasks[dataIndex].tasks[taskIndex])
    }

    openCard(data: { task: any; dataIndex: number; taskIndex: number }) {
        this.selectedTask = data.task
        this.taskData = data.task
        this.selectedTaskData = {
            dataIndex: data.dataIndex,
            taskIndex: data.taskIndex
        }

        this.taskData.users = this.userService.users.map((user: any) => {
            return {
                data: user
            }
        })

        this.taskForm.patchValue({
            ...data.task,
            createdAt: this.toDate(data.task.createdAt),
            endAt: this.toDate(data.task.endAt)
        })

        this.taskForm.get('createdAt')?.disable()
        this.isOpenedCard = !this.isOpenedCard
    }

    addCheckbox(event: any, value: any) {
        this.selectedTask.checklists[this.selectedChecklistIndex].checkboxes.push({
            label: value,
            complete: {
                stage: false
            }
        })

        this.addCheckboxRef.toggle(event)
    }

    toDate(date: any) {
        return moment(date).toDate()
    }

    addChecklist(event: any, value: any) {
        if (!Array.isArray(this.selectedTask.checklists)) {
            this.selectedTask.checklists = []
        }

        this.selectedTask.checklists.push({
            label: value,
            checkboxes: []
        })

        this.addChecklistRef.toggle(event)
    }

    hideCard() {
        this.selectedTask = {
            ...this.selectedTask,
            ...this.taskData
        }

        this.updateTask(this.selectedTask)
        this.selectedTask = null
        this.selectedTaskData = {}
    }

    selectDate(date: Date, controlName: string): void {
        if (date instanceof Date) {
            this.taskForm.patchValue({ [controlName]: date })
        }
    }

    onInput(event: any, field: string) {
        console.log(event)
        const text = event.target.innerText.trim()
        this.taskData[field] = text
    }

    getUserIds(users: any[]) {
        return users.map((user: any) => user.data?._id || user.data)
    }

    serviceDataCreated(serviceType: string, data: any) {
        this.selectedTask[serviceType].push({
            data: data._id,
            addedBy: this.userService.currentUser._id
        })

        this.updateTask(this.selectedTask)
    }

    onSelectTaskProgress(event: string) {
        if (event === 'complete') {
            this.completeTask(this.selectedTaskData.dataIndex, this.selectedTaskData.taskIndex)
        } else if (event === 'started') {
            this.selectedTask.stage.startAt = moment().toDate()
        }
    }

    changeViewType(viewType: string) {
        this.loadingConfig.isLoadingData = true
        this.storageService.setLsElement('task-view', { viewType: viewType })
        this.fetchElements()
        this.changeDetectorRef.detectChanges()
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}
