import { isJson } from '@globalShared/utils/system.utils'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor() {}
    readonly lsKey = 'state'

    get state() {
        const value = localStorage.getItem(this.lsKey) ?? ''
        if (value) {
            return JSON.parse(value)
        } else {
            return value
        }
    }

    set state(state: any) {
        const newState = JSON.stringify({ ...this.state, ...state })
        localStorage.setItem(this.lsKey, newState)
    }

    updateState(key: string, value: any): void {
        this.state = { [key]: typeof value === 'string' ? value : JSON.stringify(value) }
    }

    getStateElement(key: string): any {
        const value = this.state[key]

        if (isJson(value)) {
            return JSON.parse(value)
        } else if (value === 'true' || value === 'false') {
            return value === 'true'
        } else {
            return value
        }
    }

    getLsElement(key: string) {
        const value = localStorage.getItem(key) || ''

        if (isJson(value)) {
            return JSON.parse(value)
        }

        return value
    }

    setLsElement(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    }
}
