export function setFieldValue(
    element: any,
    field: any,
    value: any,
    config: { extraData?: any } = {}
) {
    if (config.extraData) {
        value = Object.assign(value, config.extraData)
    }

    if (typeof field === 'string') {
        field = {
            _id: field
        }
    }

    switch (field._id) {
        case 'responsibles': {
            const data = value.map((vl: any) => {
                return {
                    data: vl._id
                }
            })

            element[field._id] = data
            break
        }
        case 'connections': {
            element[field._id] = value
            break
        }
        default: {
            element[field._id] = {
                label: field.label,
                value: value
            }
        }
    }

    return element
}

export function getFieldValue(element: any, field: any, config: any = {}) {
    if (!element) {
        return undefined
    }

    if (typeof field === 'string') {
        field = {
            _id: field
        }
    }

    switch (field._id) {
        case 'responsibles': {
            return element[field._id].map((vl: any) => {
                return vl.data
            })
        }
        default: {
            const data = element[field._id]
            let value: any = data

            if (data && typeof data === 'object') {
                value = data.value
            }

            switch (field.fieldType) {
                // case 'datetime': {
                //     if (value) {
                //         return new Date(value)
                //     } else {
                //         return value
                //     }
                // }
                default: {
                    return value
                }
            }
        }
    }
}

export function isJson(str: string) {
    if (typeof str !== 'string') return false
    try {
        const result = JSON.parse(str)
        const type = Object.prototype.toString.call(result)
        return type === '[object Object]' || type === '[object Array]'
    } catch (err) {
        return false
    }
}

export function getModelFilter(query: any, defaultFilter: any = {}) {
    if (isJson(query.filter as string)) {
        const queryFilters = JSON.parse(query.filter as string)
        defaultFilter = Object.assign(defaultFilter, queryFilters)
    }

    return defaultFilter
}

export function nameFromSchemaName(schemaName: string) {
    switch (schemaName) {
        case 'Task': {
            return 'tasks'
        }
        case 'CollectionElement': {
            return 'collection-element'
        }
        default: {
            return schemaName
        }
    }
}

export function hasSystemRight(config: {
    rightPath: string
    rights: any
    mustEqualTo?: any
    mustNotEqualTo?: any
}) {
    const rightPath = config.rightPath.split('.')
    const rights = config.rights

    if (rights) {
        let currentRight = rights

        rightPath.forEach((right: string) => {
            currentRight = currentRight[right]
        })

        if (config.mustEqualTo) {
            return currentRight === config.mustEqualTo
        } else if (config.mustNotEqualTo) {
            return currentRight !== config.mustNotEqualTo
        } else {
            return typeof currentRight === 'boolean' && !!currentRight
        }
    } else {
        return false
    }
}

export function hasCollectionRight(config: {
    collectionId: any
    rights: any
    right: any
    mustEqualTo?: any
    mustNotEqualTo?: any
}) {
    const collection = config.rights.find(
        (collection: { collectionRef: any }) =>
            config.collectionId.toString() === collection.collectionRef.toString()
    )

    if (collection) {
        if (config.mustEqualTo) {
            return collection.rights[config.right] === config.mustEqualTo
        } else if (config.mustNotEqualTo) {
            return collection.rights[config.right] !== config.mustNotEqualTo
        } else {
            return false
        }
        // if (
        //     config.right &&
        //     (collection.rights[config.right] === config.mustEqualTo ||
        //         collection.rights[config.right] !== config.mustNotEqualTo ||
        //         (typeof collection.rights[config.right] === 'boolean' &&
        //             !!collection.rights[config.right]))
        // ) {
        //     return true
        // } else {
        //     return false
        // }
    } else {
        return false
    }
}

export function replaceSymbols(value: string) {
    if (!value) return ''
    return value.replace(/[@!^&\/\\#,_+()$~%.'":*?<>{}]/g, '')
}

export function getOnlyNumbers(value: string) {
    if (!value) return ''
    return value.replace(/[^0-9\.]+/g, '')
}

export function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
