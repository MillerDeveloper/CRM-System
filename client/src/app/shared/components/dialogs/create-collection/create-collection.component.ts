import { TranslateService } from '@ngx-translate/core'
import {
    COMPANIES_TEMPLATE,
    CONTACTS_TEMPLATE,
    LEADS_TEMPLATE,
    PARTNERS_TEMPLATE,
    PRODUCTS_TEMPLATE,
    SALES_TEMPLATE
} from './../../../constants/collection.constants'
import { Component } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-create-collection',
    templateUrl: './create-collection.component.html',
    styleUrls: ['./create-collection.component.scss']
})
export class CreateCollectionComponent {
    constructor(
        public readonly ref: DynamicDialogRef,
        public readonly config: DynamicDialogConfig,
        private readonly translateService: TranslateService
    ) {}

    collectionForm: FormGroup = new FormGroup({
        label: new FormGroup({
            text: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
            icon: new FormControl('😀', [Validators.required]),
            iconType: new FormControl('emoji', [Validators.required])
        }),
        elementsType: new FormControl(null, Validators.required),
        description: new FormControl(null)
    })

    selectedEmoji: string = '😀'
    isPickEmoji: boolean = false
    state: any = {
        createdType: null,
        isSelectElementsTypes: false,
        elementsType: null
    }

    templates: any[] = [
        {
            label: this.translateService.instant('templates.leads.title'),
            description: this.translateService.instant(`templates.leads.description`),
            identifier: 'leads'
        },
        {
            label: this.translateService.instant('templates.sales.title'),
            description: this.translateService.instant(`templates.sales.description`),
            identifier: 'sales'
        },
        {
            label: this.translateService.instant('templates.products.title'),
            description: this.translateService.instant(`templates.products.description`),
            identifier: 'products'
        },
        {
            label: this.translateService.instant('templates.contacts.title'),
            description: this.translateService.instant(`templates.contacts.description`),
            identifier: 'contacts'
        },
        {
            label: this.translateService.instant('templates.companies.title'),
            description: this.translateService.instant(`templates.companies.description`),
            identifier: 'companies'
        },
        {
            label: this.translateService.instant('templates.partners.title'),
            description: this.translateService.instant(`templates.partners.description`),
            identifier: 'partners'
        }
    ]

    nextStep() {
        if (this.state.createdType === 'manual' && !!this.state.elementsType) {
            this.ref.close({
                createdType: this.state.createdType,
                data: this.collectionForm.value
            })
        } else if (this.state.createdType === 'manual' && !this.state.elementsType) {
            this.state.isSelectElementsTypes = true
        }
    }

    selectElementsType(elementsType: string) {
        this.state.elementsType = elementsType
        this.collectionForm.patchValue({
            elementsType: elementsType
        })
        this.nextStep()
    }

    selectEmoji(event: any) {
        this.selectedEmoji = event.emoji.native
        this.collectionForm.patchValue({
            label: {
                icon: this.selectedEmoji
            }
        })
        this.isPickEmoji = false
    }

    selectTemplate(identifier: string) {
        let selectedTemplate = null

        switch (identifier) {
            case 'leads': {
                selectedTemplate = LEADS_TEMPLATE
                break
            }
            case 'sales': {
                selectedTemplate = SALES_TEMPLATE
                break
            }
            case 'products': {
                selectedTemplate = PRODUCTS_TEMPLATE
                break
            }
            case 'contacts': {
                selectedTemplate = CONTACTS_TEMPLATE
                break
            }
            case 'companies': {
                selectedTemplate = COMPANIES_TEMPLATE
                break
            }
            case 'partners': {
                selectedTemplate = PARTNERS_TEMPLATE
                break
            }
        }

        this.ref.close({
            createdType: this.state.createdType,
            data: selectedTemplate
        })
    }
}
