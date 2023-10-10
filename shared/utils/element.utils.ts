import { getFieldValue } from './system.utils'

export function getCurrency(element: any) {
    return getFieldValue(element, 'currency')?.code || 'USD'
}

export function getUnit(element: any) {
    return getFieldValue(element, 'unit')?.code || 'pc'
}
