import { OverlayPanel } from 'primeng/overlaypanel'
import { DialogService } from 'primeng/dynamicdialog'
import { CollectionElementService } from '@/shared/services/collection-element/collection-element.service'
import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core'
import { ConnectToElementComponent } from '@/shared/components/dialogs/connect-to-element/connect-to-element.component'
import { getFieldValue } from '@globalShared/utils/system.utils'
import { ICustomFieldConfig } from '../../element-fields.component'
import { UserService } from '@/shared/services/user/user.service'

@Component({
    selector: 'app-connections',
    templateUrl: './connections.component.html',
    styleUrls: ['./connections.component.scss']
})
export class ConnectionsComponent implements OnInit {
    @Input() config!: ICustomFieldConfig
    @ViewChild('comments') commentsRef!: OverlayPanel
    @Output() updateElement: EventEmitter<any> = new EventEmitter()

    constructor(
        public readonly collectionElementService: CollectionElementService,
        private readonly dialogService: DialogService,
        public readonly userService: UserService
    ) {}

    collectionRef!: any
    selectedConnectionElement!: any

    ngOnInit(): void {
        if (this.config?.field) {
            this.collectionRef = this.config.field.collectionRef?.data
        }
    }

    getElementLabel(element: any) {
        if (element) {
            switch (this.collectionRef.classification.elementsType) {
                case 'lively': {
                    return getFieldValue(element, 'name') || 'No name'
                }
                case 'inanimate': {
                    return getFieldValue(element, 'title') || 'No title'
                }
            }
        }
    }

    onOpenComments(event: any, element: any) {
        event.stopPropagation()
        this.selectedConnectionElement = element
        this.commentsRef.toggle(event)
    }

    onConnectToElement(event: any) {
        event.stopPropagation()

        if (this.config.disabled) {
            return
        }

        const dialogRef = this.dialogService.open(ConnectToElementComponent, {
            header: 'Connect to element',
            data: {
                showFieldsSettings: false,
                selectedCollectionId: this.collectionRef._id
            }
        })

        dialogRef.onClose.subscribe({
            next: (data: {
                selectedElements: any[]
                selectedCollection: any
                isUpdateFields: boolean
                fields: any[]
            }) => {
                console.log(data)

                if (data) {
                    if (!Array.isArray(this.config.element.connections)) {
                        this.config.element.connections = []
                    }

                    const index = this.config.element.connections.findIndex(
                        (connection: any) =>
                            connection?.collectionRef?._id === data.selectedCollection._id
                    )

                    if (index !== -1) {
                        data.selectedElements.forEach((element) => {
                            this.config.element.connections[index].elements.push(element)
                        })
                    } else {
                        this.config.element.connections.push({
                            collectionRef: data.selectedCollection._id,
                            elements: data.selectedElements
                        })
                    }

                    this.updateElement.emit({
                        element: this.config.element,
                        reload: true
                    })
                }
            }
        })
    }

    removeConnection(event: any, elementIndex: number) {
        event.preventDefault()
        event.stopPropagation()

        const index = this.config.element.connections.findIndex(
            (connection: any) => connection?.collectionRef?._id === this.collectionRef._id
        )

        if (index !== -1) {
            this.config.element.connections[index].elements.splice(elementIndex, 1)
        }

        this.updateElement.emit({
            element: this.config.element
        })
    }

    createComment(text: string) {
        const comment = {
            text: text,
            createdAt: new Date(),
            createdBy: this.userService.currentUser._id
        }

        const index = this.config.element.connections.findIndex(
            (connection: any) => connection.collectionRef._id === this.collectionRef._id
        )

        if (index !== -1) {
            const elementIndex = this.config.element.connections[index].elements.findIndex(
                (element: any) => element.data?._id === this.selectedConnectionElement.data._id
            )

            if (elementIndex !== -1) {
                if (
                    !Array.isArray(
                        this.config.element.connections[index].elements[elementIndex].comments
                    )
                ) {
                    this.config.element.connections[index].elements[elementIndex].comments = [
                        comment
                    ]
                } else {
                    this.config.element.connections[index].elements[elementIndex].comments.push(
                        comment
                    )
                }

                this.updateElement.emit({
                    element: this.config.element,
                    reload: false
                })
            }
        }
    }

    removeComment(commentIndex: number) {
        const index = this.config.element.connections.findIndex(
            (connection: any) => connection.collectionRef._id === this.collectionRef._id
        )

        if (index !== -1) {
            const elementIndex = this.config.element.connections[index].elements.findIndex(
                (element: any) => element.data?._id === this.selectedConnectionElement.data._id
            )

            if (elementIndex !== -1) {
                this.config.element.connections[index].elements[elementIndex].comments.splice(
                    commentIndex,
                    1
                )

                this.updateElement.emit({
                    element: this.config.element,
                    reload: false
                })
            }
        }
    }
}
