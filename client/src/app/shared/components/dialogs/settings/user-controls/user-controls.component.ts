import { MenuItem } from 'primeng/api'
import { CompanyService } from '@/shared/services/company/company.service'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-user-controls',
    templateUrl: './user-controls.component.html',
    styleUrls: ['./user-controls.component.scss']
})
export class UserControlsComponent implements OnInit {
    constructor(
        public readonly ref: DynamicDialogRef,
        private readonly companyService: CompanyService,
        public readonly config: DynamicDialogConfig
    ) {}

    userForm: FormGroup = new FormGroup({
        departments: new FormControl([])
    })
    rightSelection: any[] = [
        { label: 'Forbidden', value: 'forbidden' },
        { label: 'Responsible', value: 'responsible' },
        { label: 'Allowed', value: 'allowed' }
    ]

    stage: any = {
        isFilledFields: false,
        isFilledCollectionsRights: false
    }
    user!: any
    userDepartments: any[] = []
    departmentsMenuModel: MenuItem[] = []
    rights!: any
    selectedDepartment!: any
    modules: any[] = [
        {
            label: 'Tasks',
            modulePath: 'tasks'
        },
        {
            label: 'Settings',
            modulePath: 'settings'
        }
    ]

    ngOnInit(): void {
        if (this.config.data) {
            this.userDepartments = this.config.data.userDepartments

            if (this.config.data.user) {
                this.user = this.config.data.user

                this.userForm.patchValue({
                    departments: this.companyService.getUserDepartments(this.user.departments)
                })
            }
        }
    }

    setDepartmentsMenu() {
        this.departmentsMenuModel = this.userForm.value.departments.reduce(
            (acc: any, department: any) => {
                acc.push({
                    label: department.name,
                    command: () => {
                        this.selectedDepartment = department
                        this.stage.saveWithDepartmentRights = true
                        this.nextStep()
                    }
                })
                return acc
            },
            []
        )
    }

    nextStep(): void {
        if (this.stage.saveWithDepartmentRights) {
            const selectedDepartment = this.selectedDepartment ?? this.userForm.value.departments[0]
            this.rights = selectedDepartment.rights
            this.close()
        } else {
            if (!this.stage.isFilledFields) {
                this.stage.isFilledFields = true
            } else if (!this.stage.isFilledCollectionsRights) {
                this.stage.isFilledCollectionsRights = true
            } else if (!this.stage.isFilledSystemRights) {
                this.close()
            }
        }
    }

    close() {
        this.userForm.value.departments = this.userForm.value.departments.map((department: any) => {
            return {
                departmentRef: department._id
            }
        })

        this.ref.close({
            data: {
                ...this.userForm.value,
                rights: {
                    system: this.rights.system,
                    collections: this.rights.collections
                }
            }
        })
    }

    rightsChanged(event: { data: any }) {
        this.rights = event.data
    }
}
