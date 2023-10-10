import { SystemService } from '@/shared/services/system/system.service'
import { ConnectToElementComponent } from '@/shared/components/dialogs/connect-to-element/connect-to-element.component'
import { CollectionElementService } from './../../shared/services/collection-element/collection-element.service'
import { PrimeIcons } from 'primeng/api'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { CollectionService } from '@/shared/services/collection/collection.service'
import { ActivatedRoute, Router } from '@angular/router'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { DialogService } from 'primeng/dynamicdialog'
import { CompanyService } from '@/shared/services/company/company.service'
import { UserService } from '@/shared/services/user/user.service'
import { DeliveryService } from '@/shared/services/deliveries/delivery.service'

@Component({
    selector: 'app-element-card',
    templateUrl: './element-card.component.html',
    styleUrls: ['./element-card.component.scss']
})
export class ElementCardComponent implements OnInit {
    constructor(
        private readonly collectionService: CollectionService,
        public readonly collectionElementService: CollectionElementService,
        private readonly route: ActivatedRoute,
        private readonly dialogService: DialogService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly companyService: CompanyService,
        private readonly router: Router,
        private readonly systemService: SystemService,
        private readonly deliveryService: DeliveryService,
        public readonly userService: UserService
    ) {}

    config!: {
        collectionId: string
        elementId: string
        activeTabIndex?: number
    }

    collection!: any
    element!: any
    viewOptions: any = []
    collectionConfig!: any
    fields: any[] = []
    selectedConnection!: any
    selectedConnectionElement!: any
    activities: any[] = [
        {
            status: 'Ordered',
            date: '15/10/2020 10:30',
            icon: PrimeIcons.SHOPPING_CART,
            color: '#9C27B0',
            image: 'game-controller.jpg'
        },
        { status: 'Processing', date: '15/10/2020 14:00', icon: PrimeIcons.COG, color: '#673AB7' },
        {
            status: 'Shipped',
            date: '15/10/2020 16:15',
            icon: PrimeIcons.ENVELOPE,
            color: '#FF9800'
        },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: PrimeIcons.CHECK, color: '#607D8B' }
    ]
    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }

    ngOnInit(): void {
        if (
            this.route.snapshot.paramMap.has('collectionId') &&
            this.route.snapshot.paramMap.has('elementId')
        ) {
            this.loadingConfig.isLoadingData = true
            this.config = {
                collectionId: this.route.snapshot.paramMap.get('collectionId') as string,
                elementId: this.route.snapshot.paramMap.get('elementId') as string
            }

            this.fetchCollection()
        }
    }

    setView() {
        this.viewOptions = this.collection.viewOptions
        this.collectionConfig = this.collectionService.getCollectionConfig(this.collection)
    }

    fetchCollection() {
        this.loadingConfig.isLoadingData = true
        this.collectionService.findOne(this.config.collectionId).subscribe({
            next: (result: any) => {
                this.collection = result.collection

                if (this.collection) {
                    this.setView()
                    this.fetchElement()
                }
            }
        })
    }

    fetchElement() {
        this.loadingConfig.isLoadingData = true
        this.collectionElementService
            .findOne(this.config.collectionId, this.config.elementId)
            .subscribe({
                next: (data: { element: any }) => {
                    this.element = data.element
                    this.fields = this.collectionService.getFields(
                        this.viewOptions,
                        this.collectionConfig.viewOption._id
                    )

                    this.loadingConfig.isLoadingData = false
                }
            })
    }

    activeTabIndexChange(config: { index: number }) {
        this.config.activeTabIndex = config.index
    }

    saveElement() {
        this.collectionElementService.update(this.element).subscribe({
            next: () => {
                this.exit()
            }
        })
    }

    onConnectToElement() {
        const dialogRef = this.dialogService.open(ConnectToElementComponent, {
            header: 'Connect to element',
            data: {
                showFieldsSettings: true
            }
        })

        dialogRef.onClose.subscribe({
            next: (data: {
                selectedElements: any[]
                selectedCollection: any
                isUpdateFields: boolean
                fields: any[]
            }) => {
                if (data) {
                    if (!Array.isArray(this.element.connections)) {
                        this.element.connections = []
                    }

                    const index = this.element.connections.findIndex(
                        (connection: any) =>
                            connection?.collectionRef._id === data.selectedCollection._id
                    )

                    if (index !== -1) {
                        data.selectedElements.forEach((element) => {
                            this.element.connections[index].elements.push(element)
                        })
                    } else {
                        this.element.connections.push({
                            collectionRef: data.selectedCollection._id,
                            elements: data.selectedElements
                        })
                    }

                    if (data.isUpdateFields) {
                        const collectionConfig: any = this.collectionService.getCollectionConfig(
                            data.selectedCollection
                        )

                        data.selectedCollection.viewOptions = this.collectionService.setFields(
                            data.selectedCollection.viewOptions,
                            collectionConfig.viewOption._id,
                            data.fields
                        )

                        this.updateCollection(data.selectedCollection)
                    }

                    this.updateElement()
                    this.fetchCollection()
                }
            }
        })
    }

    updateElement(config: { reload: boolean } = { reload: true }) {
        this.loadingConfig.isLoadingData = config.reload
        this.collectionElementService.update(this.element).subscribe({
            next: (result: { element: any }) => {
                this.element = result.element

                if (config.reload) {
                    this.loadingConfig.isLoadingData = false
                    this.fetchElement()
                }

                this.changeDetectorRef.detectChanges()
            }
        })
    }

    updateCollection(collection: any = this.collection) {
        this.loadingConfig.isLoadingData = true
        this.collectionService.update(collection).subscribe({
            next: async (result: { collection: any }) => {
                if (result.collection) {
                    this.collection = result.collection
                }

                this.setView()
                await this.companyService.init()
                this.changeDetectorRef.detectChanges()
                this.loadingConfig.isLoadingData = false
            }
        })
    }

    showCard(collection: any, element: any) {
        this.systemService.refreshComponent(
            `collection/${collection.collectionRef._id}/${element._id}`
        )
    }

    deleteElement() {
        this.collectionElementService.deleteOne(this.element._id).subscribe({
            next: () => {
                this.exit()
            }
        })
    }

    removeConnection(connection: any, element: any) {
        const collectionIndex = this.element.connections.findIndex(
            (conn: any) => conn?.collectionRef._id === connection.collectionRef._id
        )

        if (collectionIndex !== -1) {
            const elementIndex = this.element.connections[collectionIndex].elements.findIndex(
                (connectedElement: any) => element.data?._id === connectedElement.data._id
            )

            if (elementIndex !== -1) {
                this.element.connections[collectionIndex].elements.splice(elementIndex, 1)
                if (this.element.connections[collectionIndex].elements.length === 0) {
                    this.element.connections.splice(collectionIndex, 1)
                }

                this.updateElement()
                this.setView()

                this.changeDetectorRef.detectChanges()
            }
        }
    }

    serviceDataCreated(serviceType: string, data: any) {
        switch (serviceType) {
            case 'chats': {
                this.element.chatRef = {
                    data: data._id
                }

                break
            }
            default: {
                this.element[serviceType].push({
                    data: data._id,
                    addedBy: this.userService.currentUser._id
                })
            }
        }

        this.updateElement({ reload: false })
    }

    hasRight(rightPath: string, config: { mustEqualTo?: any; mustNotEqualTo?: any }) {
        return this.userService.hasSystemRight({
            rightPath: rightPath,
            rights: this.userService.currentUser.rights.system?.modules,
            mustEqualTo: config.mustEqualTo || undefined,
            mustNotEqualTo: config.mustNotEqualTo || undefined
        })
    }

    exit() {
        this.router.navigate(['collection', this.collection._id])
    }
}
