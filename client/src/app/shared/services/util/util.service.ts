import isUrl from 'validator/lib/isURL'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    constructor() {}

    isUrl(url: string | null | undefined): boolean {
        if (!url) {
            return false
        } else {
            return isUrl(url)
        }
    }
}
