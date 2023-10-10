import {TranslateService} from '@ngx-translate/core'
import { IUser } from '@globalInterfaces/user.interface'
import { OverlayPanel } from 'primeng/overlaypanel'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { IFetchConfig, ILoadingConfig } from '@/shared/interfaces/global.interface'
import { CreateCollectionComponent } from './../dialogs/create-collection/create-collection.component'
import { CompanyService } from '@/shared/services/company/company.service'
import { SystemService } from '@/shared/services/system/system.service'
import {
    Component,
    EventEmitter,
    OnInit,
    Output,
    ChangeDetectorRef,
    Input,
    ViewChild
} from '@angular/core'
import { ICompany } from '@globalShared/interfaces/company.interface'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { NotificationService } from '@/shared/services/notification/notification.service'
import { InviteUsersComponent } from '../dialogs/invite-users/invite-users.component'
import {
    ALL_DEFAULT_FIELDS,
    NAME_FIELD,
    TITLE_FIELD
} from '@globalShared/constants/element.constants'
import { UserService } from '@/shared/services/user/user.service'
import { UtilService } from '@/shared/services/util/util.service'

@Component({
    selector: 'app-main-sidebar',
    templateUrl: './main-sidebar.component.html',
    styleUrls: ['./main-sidebar.component.scss'],
    providers: [DialogService]
})
export class MainSidebarComponent implements OnInit {
    @Input() config: { isClosedSidebar: boolean } = {
        isClosedSidebar: false
    }
    @ViewChild('searchOverlay', { static: false }) searchOverlayRef!: OverlayPanel
    @ViewChild('menuOverlay', { static: false }) menuOverlayRef!: OverlayPanel
    @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter()

    constructor(
        private readonly companyService: CompanyService,
        public readonly systemService: SystemService,
        public readonly dialogService: DialogService,
        private readonly collectionService: CollectionService,
        public readonly collectionElementService: CollectionElementService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly notificationService: NotificationService,
        private readonly translateService: TranslateService,
        public readonly userService: UserService,
        public readonly utilService: UtilService
    ) {}

    currentUser!: IUser
    openedDialogs = {
        createCollection: false
    }
    loadingConfig: ILoadingConfig = {
        isLoadingData: true
    }
    fetchConfig: IFetchConfig = {
        rows: 50,
        skip: 0,
        totalCount: 0,
        filter: {}
    }

    searchConfig: any = {
        elements: [],
        collection: null
    }
    searchTimeout!: any
    notifications: any[] = []
    collections: any[] = []
    currentCompany: ICompany = this.companyService.currentCompany

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser
        this.collectionService.findAll({}).subscribe({
            next: (result: any) => {
                this.collections = result.collections
                this.loadingConfig.isLoadingData = false
            }
        })

        this.fetchNotifications()
    }

    fetchNotifications(): void {
        this.notificationService.findAll({}).subscribe({
            next: (response: { notifications: any[] }) => {
                this.notifications = response.notifications
            }
        })
    }

    onCreateCollection() {
        const dialogRef: DynamicDialogRef = this.dialogService.open(CreateCollectionComponent, {
            header: this.translateService.instant('collection.createCollection')
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any; createdType: string }) => {
                if (result) {
                    this.collectionService.createCollection(result.data).subscribe({
                        next: async (result: { collection: any }) => {
                            if (result) {
                                await this.companyService.init()
                                this.changeDetectorRef.detectChanges()
                                this.systemService.refreshComponent(
                                    `/collection/${result.collection._id}`
                                )


                                window.location.reload()
                            }
                        }
                    })
                }
            }
        })
    }

    deleteNotification(notification: any) {
        this.notificationService.deleteOne(notification._id).subscribe({
            next: (response: any) => {
                this.fetchNotifications()
            }
        })
    }

    onInviteUsers() {
        const dialogRef = this.dialogService.open(InviteUsersComponent, {
            header: this.translateService.instant('global.inviteMembers')
        })

        dialogRef.onClose.subscribe({
            next: () => {}
        })
    }

    onToggleSidebar(event: any) {
        event.stopImmediatePropagation()
        event.preventDefault()
        this.toggleSidebar.emit()
    }

    onSearch(event: any, text: any) {
        clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
            this.fetchConfig = this.collectionElementService.getSearchConfig(
                text,
                ALL_DEFAULT_FIELDS,
                this.fetchConfig
            )

            this.collectionElementService.findInAllCollections({}, {}, this.fetchConfig).subscribe({
                next: (response: { collection: any; elements: any[] }) => {
                    this.searchConfig.collection = response.collection
                    this.searchConfig.elements = response.elements
                    this.searchConfig.text = text

                    if (response.collection.classification.elementsType === 'lively') {
                        this.searchConfig.field = NAME_FIELD
                    } else {
                        this.searchConfig.field = TITLE_FIELD
                    }

                    this.searchOverlayRef.toggle(event)
                }
            })
        }, 1000)
    }

    openCard(element: any) {
        const url = `/collection/${this.searchConfig.collection._id}/${element._id}`
        this.systemService.refreshComponent(url)
    }

    hasRight(rightPath: string, config: { mustEqualTo?: any; mustNotEqualTo?: any }) {
        return this.userService.hasSystemRight({
            rightPath: rightPath,
            rights: this.currentUser.rights.system?.modules,
            mustEqualTo: config.mustEqualTo || undefined,
            mustNotEqualTo: config.mustNotEqualTo || undefined
        })
    }

    forceReload() {
        this.systemService.forceReload()
    }

    logout(event: any) {
        event.stopPropagation()
        this.systemService.logout()
    }
}
