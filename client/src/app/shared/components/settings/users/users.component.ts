import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { InviteUsersComponent } from './../../dialogs/invite-users/invite-users.component'
import { UserControlsComponent } from './../../dialogs/settings/user-controls/user-controls.component'
import { CompanyService } from './../../../services/company/company.service'
import { DialogService } from 'primeng/dynamicdialog'
import { UserService } from '@/shared/services/user/user.service'
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { UserGroupControlComponent } from '../../dialogs/settings/user-group-control/user-group-control.component'
import { MenuItem } from 'primeng/api'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    constructor(
        private readonly userService: UserService,
        private readonly companyService: CompanyService,
        private readonly dialogService: DialogService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly translateService: TranslateService
    ) {}

    users: any[] = []
    currentCompany!: any
    selectedUser!: any
    selectedDepartment!: any
    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }
    groupedUsers: any[] = []
    userDepartmentMenuModel: MenuItem[] = [
        { label: 'Settings', icon: 'pi pi-cog', command: () => this.onSettingUser() }
        // { label: 'Delete', icon: 'pi pi-trash' }
    ]
    userDepartments: any[] = []

    ngOnInit(): void {
        this.currentCompany = this.companyService.currentCompany

        if (this.currentCompany) {
            this.userDepartments = this.currentCompany.settings.users.departments
            this.init()
        }
    }

    async init() {
        this.loadingConfig.isLoadingData = true
        await this.userService.init()
        this.groupUsersByDepartments()
    }

    groupUsersByDepartments() {
        this.users = this.userService.users
        const noDepartment = {
            name: 'No department'
        }

        this.users.forEach((user: any) => {
            if (user.departments?.length > 0) {
                const departments = this.companyService.getUserDepartments(user.departments)

                if (departments.length > 0) {
                    departments.forEach((department: any) => {
                        this.groupedUsers.push({
                            ...user,
                            department: department
                        })
                    })
                } else {
                    this.groupedUsers.push({
                        ...user,
                        department: noDepartment
                    })
                }
            } else {
                this.groupedUsers.push({
                    ...user,
                    department: noDepartment
                })
            }
        })

        this.loadingConfig.isLoadingData = false
        this.changeDetectorRef.detectChanges()
    }

    openUserGroupModal(modalMode: string) {
        const dialogRef = this.dialogService.open(UserGroupControlComponent, {
            header: modalMode === 'create' ? 'Create group' : 'Update group',
            data: { department: this.selectedDepartment, modalMode: modalMode }
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any }) => {
                if (result) {
                    if (modalMode === 'create') {
                        if (!this.currentCompany.settings) {
                            this.currentCompany.settings = {
                                users: {
                                    departments: []
                                }
                            }
                        } else if (!Array.isArray(this.currentCompany.settings.users.departments)) {
                            this.currentCompany.settings.users.departments = []
                        }

                        this.currentCompany.settings.users.departments.push(result.data)
                    } else {
                        const index = this.currentCompany.settings.users.departments.findIndex(
                            (department: any) => department._id === this.selectedDepartment._id
                        )

                        if (index !== -1) {
                            this.currentCompany.settings.users.departments[index] = result.data
                        }
                    }

                    this.updateCompany()
                }
            }
        })
    }

    onInviteUsers() {
        const dialogRef = this.dialogService.open(InviteUsersComponent, {
            header: this.translateService.instant('global.inviteMembers')
        })

        dialogRef.onClose.subscribe({
            next: async () => {
                await this.init()
            }
        })
    }

    updateCompany() {
        this.companyService.updateOne(this.currentCompany).subscribe({
            next: async (response: { currentCompany: any }) => {
                this.currentCompany = response.currentCompany
                await this.init()
            }
        })
    }

    deleteUserGroup(groupIndex: number) {
        this.currentCompany.settings.users.departments.splice(groupIndex, 1)
        this.updateCompany()
    }

    onSettingUser() {
        const dialogRef = this.dialogService.open(UserControlsComponent, {
            header: 'Setting user',
            data: {
                user: this.selectedUser,
                userDepartments: this.userDepartments
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: {
                data: { rights: { system: any; collections: any }; departments: any }
            }) => {
                if (result && this.selectedUser) {
                    this.selectedUser.rights = result.data.rights
                    this.selectedUser.departments = result.data.departments

                    this.userService.updateOne(this.selectedUser).subscribe({
                        next: async () => {
                            await this.init()
                            if (this.selectedUser._id === this.userService.currentUser._id) {
                                location.reload()
                            }

                            this.selectedUser = null
                        }
                    })
                }
            }
        })
    }

    getRegisterMethod(user: any) {
        const method = user.info?.register.method

        switch (method) {
            case 'invitation': {
                return 'Invitation'
            }
            default: {
                return 'Self Registration'
            }
        }
    }
}
