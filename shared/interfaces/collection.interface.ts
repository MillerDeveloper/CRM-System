export interface IField {
    _id?: any
    label: string
    optionLabel: string,
    optionValue: string
    displayType: string
    fieldType: string
    displayName: string
    disabled: boolean
    settings: {
        mode: string
        prefix: string
        suffix: string
        frozen: {
            active: boolean
        }
        canDelete: boolean
        setColor: boolean
    }
    usage: {
        element: {
            onCreation: boolean
            onConnection: boolean
        }
    }
    icon: string
    options: [{
        label: string
        color: string
        bgColor: string
        textColor: string
    }]
    defaultValue: any
    collectionRef: {
        data: any
    }
}

export interface IViewOption {
    _id: any
    viewType: string
    fields: IField[]
}
