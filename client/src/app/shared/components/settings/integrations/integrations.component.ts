import { NovaposhtaControlsComponent } from './../../dialogs/settings/integrations/novaposhta-controls/novaposhta-controls.component'
import { ICompany } from '@globalShared/interfaces/company.interface'
import { DialogService } from 'primeng/dynamicdialog'
import { Component, OnInit } from '@angular/core'
import { BinotelControlsComponent } from '../../dialogs/settings/integrations/binotel-controls/binotel-controls.component'
import { CompanyService } from '@/shared/services/company/company.service'
import { TelegramControlsComponent } from '../../dialogs/settings/integrations/telegram-controls/telegram-controls.component'

@Component({
    selector: 'app-integrations',
    templateUrl: './integrations.component.html',
    styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {
    constructor(
        private readonly dialogService: DialogService,
        private readonly companyService: CompanyService
    ) {}

    currentCompany: any = this.companyService.currentCompany

    ngOnInit(): void {}

    openIntegrationControls(integration: string) {
        if (!this.currentCompany.integrations) {
            this.currentCompany.integrations = {}
        }

        if (!this.currentCompany.integrations[integration]) {
            this.currentCompany.integrations[integration] = {}
        }

        let dialogRef!: any
        const integrations = this.companyService.currentCompany.integrations

        switch (integration) {
            case 'binotel': {
                dialogRef = this.dialogService.open(BinotelControlsComponent, {
                    header: 'Integrate binotel',
                    data: {
                        info: integrations?.binotel
                    }
                })

                break
            }

            case 'novaposhta': {
                dialogRef = this.dialogService.open(NovaposhtaControlsComponent, {
                    header: 'Integrate Novaposhta',
                    data: {
                        info: integrations?.novaposhta
                    }
                })

                break
            }

            case 'telegram': {
                dialogRef = this.dialogService.open(TelegramControlsComponent, {
                    header: 'Integrate Telegram',
                    data: {
                        info: integrations.telegram
                    }
                })
            }
        }

        dialogRef.onClose.subscribe({
            next: (result: { data: any }) => {
                if (result) {
                    this.currentCompany.integrations[integration] = result.data
                    this.updateCompany()
                }
            }
        })
    }

    updateCompany() {
        this.companyService.updateOne(this.currentCompany).subscribe({
            next: () => {}
        })
    }
}
