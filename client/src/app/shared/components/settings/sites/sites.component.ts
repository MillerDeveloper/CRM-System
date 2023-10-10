import { DialogService } from 'primeng/dynamicdialog'
import { Component, OnInit } from '@angular/core'
import { SiteControlsComponent } from '../../dialogs/settings/site-controls/site-controls.component'
import { CompanyService } from '@/shared/services/company/company.service'
import { UserService } from '@/shared/services/user/user.service'

@Component({
    selector: 'app-sites',
    templateUrl: './sites.component.html',
    styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
    constructor(
        private readonly dialogService: DialogService,
        private readonly companyService: CompanyService,
        private readonly userService: UserService
    ) {}
    sites: any[] = []
    currentCompany!: any
    currentUser!: any

    ngOnInit() {
        this.currentCompany = this.companyService.currentCompany
        this.currentUser = this.userService.currentUser
    }

    onAddSite() {
        const dialogRef = this.dialogService.open(SiteControlsComponent, {
            header: 'Add new site',
            data: {
                mode: 'create'
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any }) => {
                if (result) {
                    if (!Array.isArray(this.currentCompany.sites)) {
                        this.currentCompany.sites = []
                    }

                    this.currentCompany.sites.push(result.data)
                    this.updateCompany()
                }
            }
        })
    }

    updateCompany() {
        this.companyService.updateOne(this.currentCompany).subscribe({
            next: async () => {
                await this.companyService.init()
            }
        })
    }

    removeSite(index: number) {
        this.currentCompany.sites.splice(index, 1)
        this.updateCompany()
    }

    settingSite(index: number) {
        const site = this.currentCompany.sites[index]
        const dialogRef = this.dialogService.open(SiteControlsComponent, {
            header: 'Upadate site',
            data: {
                mode: 'update',
                site: site
            }
        })

        dialogRef.onClose.subscribe({
            next: (result: { data: any }) => {
                if (result) {
                    this.currentCompany.sites[index] = result.data
                    this.updateCompany()
                }
            }
        })
    }
}
