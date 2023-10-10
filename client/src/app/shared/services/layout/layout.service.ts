import { Injectable } from '@angular/core'

const breakpoints: any = {
    tablet: {
        min: 600,
        max: 840
    },
    web: {
        min: 840,
        max: 1280
    },
    large: {
        min: 1280,
        max: 1920
    }
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    constructor() {}

    get pageWidth(): number {
        return window.innerWidth
    }

    isLarger(breakpoint: string, includeCurrent: boolean = true) {
        const key = includeCurrent ? 'min' : 'max';
        return breakpoints[breakpoint][key] < this.pageWidth
    }

    isSmaller(breakpoint: string, includeCurrent: boolean = true) {
        const key = includeCurrent ? 'max' : 'min';
        return breakpoints[breakpoint][key] > this.pageWidth
    }

    is(breakpoint: string) {
        if (!this.isLarger(breakpoint) && !this.isSmaller(breakpoint)) {
            return true
        } else {
            return false
        }
    }

    isVisibleText(breakpoint: string, text: string, config?: { reverse: boolean }): string {

        if (this.isLarger(breakpoint, true)) {
            return text
        } else {
            return ''
        }
    }
}
