import { TranslateService } from '@ngx-translate/core'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
    selector: 'app-user-rights',
    templateUrl: './user-rights.component.html',
    styleUrls: ['./user-rights.component.scss']
})
export class UserRightsComponent implements OnInit {
    @Input() config!: {
        modalMode: 'collectionsRights' | 'systemRights'
        rights?: { system: any; collections: any[] }
    }
    @Output() rightsChanged: EventEmitter<any> = new EventEmitter()

    constructor(
        private readonly collectionService: CollectionService,
        private readonly translateService: TranslateService
    ) {}

    rightSelection: any[] = [
        { label: this.translateService.instant('global.forbidden'), value: 'forbidden' },
        { label: this.translateService.instant('global.responsible'), value: 'responsible' },
        { label: this.translateService.instant('global.allowed'), value: 'allowed' }
    ]

    binaryRightSelection: any[] = [
        { label: this.translateService.instant('global.forbidden'), value: 'forbidden' },
        { label: this.translateService.instant('global.allowed'), value: 'allowed' }
    ]

    modules: any[] = [
        {
            label: this.translateService.instant('tasks.title'),
            modulePath: 'tasks',
            fields: [
                {
                    identifier: 'create',
                    fieldType: 'checkbox'
                },
                {
                    identifier: 'view',
                    fieldType: 'selectButton',
                    options: this.rightSelection
                },
                {
                    identifier: 'edit',
                    fieldType: 'selectButton',
                    options: this.rightSelection
                },
                {
                    identifier: 'delete',
                    fieldType: 'selectButton',
                    options: this.rightSelection
                },
                {
                    identifier: 'complete',
                    fieldType: 'selectButton',
                    options: this.rightSelection
                }
            ]
        },
        {
            label: this.translateService.instant('collection.title'),
            modulePath: 'collections',
            fields: [
                {
                    identifier: 'create',
                    fieldType: 'checkbox'
                },
                {
                    identifier: 'view',
                    fieldType: 'selectButton',
                    options: this.rightSelection
                },
                {
                    identifier: 'edit',
                    fieldType: 'selectButton',
                    options: this.rightSelection
                },
                {
                    identifier: 'delete',
                    fieldType: 'selectButton',
                    options: this.rightSelection
                }
            ]
        },
        {
            label: this.translateService.instant('analytics.title'),
            modulePath: 'analytics',
            fields: [
                {
                    identifier: 'view',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                }
            ]
        },
        {
            label: this.translateService.instant('mail.title'),
            modulePath: 'mail',
            fields: [
                {
                    identifier: 'send',
                    fieldType: 'checkbox'
                },
                {
                    identifier: 'view',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                },
                {
                    identifier: 'delete',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                }
            ]
        },
        {
            label: this.translateService.instant('files.title'),
            modulePath: 'files',
            fields: [
                {
                    identifier: 'upload',
                    fieldType: 'checkbox'
                },
                {
                    identifier: 'view',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                },
                {
                    identifier: 'delete',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                }
            ]
        },
        {
            label: this.translateService.instant('delivery.title'),
            modulePath: 'deliveries',
            fields: [
                {
                    identifier: 'create',
                    fieldType: 'checkbox'
                },
                {
                    identifier: 'view',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                },
                {
                    identifier: 'delete',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                }
            ]
        },
        {
            label: this.translateService.instant('calls.title'),
            modulePath: 'calls',
            fields: [
                {
                    identifier: 'create',
                    fieldType: 'checkbox'
                },
                {
                    identifier: 'view',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                },
                {
                    identifier: 'delete',
                    fieldType: 'selectButton',
                    options: this.binaryRightSelection
                }
            ]
        },
        {
            label: this.translateService.instant('settings.title'),
            modulePath: 'settings',
            expand: true,
            fields: [
                {
                    identifier: 'settingCompany',
                    fieldType: 'checkbox'
                },
                {
                    identifier: 'createCompany',
                    fieldType: 'checkbox'
                }
            ],
            expandData: [
                {
                    label: this.translateService.instant('settings.members'),
                    modulePath: 'users',
                    fields: [
                        {
                            identifier: 'invite',
                            fieldType: 'checkbox'
                        },
                        {
                            identifier: 'view',
                            fieldType: 'selectButton',
                            options: this.binaryRightSelection
                        },
                        {
                            identifier: 'delete',
                            fieldType: 'selectButton',
                            options: this.binaryRightSelection
                        }
                    ]
                },
                {
                    label: this.translateService.instant('settings.integrations'),
                    modulePath: 'integrations',
                    fields: [
                        {
                            identifier: 'edit',
                            fieldType: 'selectButton',
                            options: this.binaryRightSelection
                        }
                    ]
                },
                {
                    label: this.translateService.instant('settings.sites'),
                    modulePath: 'sites',
                    fields: [
                        {
                            identifier: 'edit',
                            fieldType: 'selectButton',
                            options: this.binaryRightSelection
                        }
                    ]
                }
            ]
        }
    ]

    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }

    rightsForm: FormGroup = new FormGroup({
        system: new FormGroup({
            access: new FormGroup({
                entrance: new FormControl(false)
            }),
            inviteMembers: new FormGroup({
                access: new FormControl(false)
            }),
            modules: new FormGroup({
                tasks: new FormGroup({
                    create: new FormControl(false),
                    view: new FormControl('forbidden'),
                    edit: new FormControl('forbidden'),
                    delete: new FormControl('forbidden'),
                    complete: new FormControl('forbidden')
                }),
                settings: new FormGroup({
                    createCompany: new FormControl(false),
                    settingCompany: new FormControl(false),
                    users: new FormGroup({
                        invite: new FormControl(false),
                        view: new FormControl('forbidden'),
                        delete: new FormControl('forbidden')
                    }),
                    integrations: new FormGroup({
                        edit: new FormControl('forbidden')
                    }),
                    sites: new FormGroup({
                        edit: new FormControl('forbidden')
                    })
                }),
                collections: new FormGroup({
                    create: new FormControl(false),
                    view: new FormControl('forbidden'),
                    edit: new FormControl('forbidden'),
                    delete: new FormControl('forbidden')
                }),
                analytics: new FormGroup({
                    view: new FormControl('forbidden')
                }),
                mail: new FormGroup({
                    send: new FormControl(false),
                    view: new FormControl('forbidden'),
                    delete: new FormControl('forbidden')
                }),
                files: new FormGroup({
                    upload: new FormControl(false),
                    view: new FormControl('forbidden'),
                    delete: new FormControl('forbidden')
                }),
                deliveries: new FormGroup({
                    create: new FormControl(false),
                    view: new FormControl('forbidden'),
                    delete: new FormControl('forbidden')
                }),
                calls: new FormGroup({
                    create: new FormControl(false),
                    view: new FormControl('forbidden'),
                    delete: new FormControl('forbidden')
                })
            })
        }),
        collections: new FormControl([])
    })

    ngOnInit(): void {
        this.fetchCollections()

        if (this.config?.rights) {
            this.rightsForm.patchValue({
                system: this.config.rights.system,
                collections: this.config.rights.collections
            })
        }
    }

    fetchCollections() {
        this.loadingConfig.isLoadingData = true
        const collections: any[] = []
        this.collectionService.findAll({}).subscribe({
            next: (response: { collections: any[] }) => {
                response.collections.forEach((collection: any) => {
                    let rights = {
                        create: false,
                        view: 'forbidden',
                        edit: 'forbidden',
                        delete: 'forbidden',
                        import: false,
                        export: false
                    }

                    if (this.config.rights?.collections) {
                        const index = this.config.rights.collections.findIndex((cl: any) => {
                            return cl.collectionRef === collection._id
                        })

                        if (index !== -1) {
                            rights = this.config.rights.collections[index].rights
                        }
                    }

                    collections.push({
                        collectionRef: collection._id,
                        label: collection.label,
                        rights: rights
                    })
                })

                this.rightsForm.patchValue({
                    collections: collections
                })

                this.onRightsChanged()
                this.loadingConfig.isLoadingData = false
            }
        })
    }

    hasRightField(rightType: string, modulePath: string, field: string) {
        return this.rightsForm.get('system.modules')?.get(modulePath)?.get(field)
    }

    onRightsChanged() {
        this.rightsChanged.emit({ data: this.rightsForm.value })
    }
}
