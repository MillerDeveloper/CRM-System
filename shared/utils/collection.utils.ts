export function getElementFields(
    viewOptions: any[],
    currentViewOptionId: string,
    fieldsType: string = 'basic'
) {
    const index = viewOptions.findIndex((option: any) => option._id === currentViewOptionId)

    if (index !== -1) {
        const fields = viewOptions[index].fields
        switch (fieldsType) {
            case 'connectionElement': {
                return fields.filter((field: any) => field.usage.element.onConnection)
            }
            case 'initialElement': {
                return fields.filter((field: any) => field.usage.element.onCreation)
            }
            default: {
                return fields
            }
        }
    }

    return []
}

export function getAllElementFields(viewOptions: any[]) {
    let fields: any[] = []
    viewOptions.forEach((option: any) => {
        fields = fields.concat(option.fields)
    })

    return fields
}

export function getOneField(fields: any[], fieldId: string) {
    const index = fields.findIndex((fl: any) => fl._id === fieldId)
    if (index !== -1) {
        return fields[index]
    } else {
        return null
    }
}
