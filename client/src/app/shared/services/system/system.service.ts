import { StorageService } from './../storage/storage.service'
import { CookieService } from 'ngx-cookie-service'
import { HostListener, Injectable, isDevMode, OnDestroy } from '@angular/core'
import { NavigationEnd, NavigationStart, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { PrimeNGConfig, MessageService } from 'primeng/api'
import { HttpErrorResponse } from '@angular/common/http'
import { DOCUMENT } from '@angular/common'
import { Inject } from '@angular/core'
import { UserService } from '../user/user.service'
import { CompanyService } from '../company/company.service'

@Injectable({
    providedIn: 'root'
})
export class SystemService {
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private readonly userService: UserService,
        private readonly router: Router,
        private readonly cookieService: CookieService,
        private readonly translateService: TranslateService,
        private readonly primeNGConfig: PrimeNGConfig,
        private readonly messageService: MessageService,
        private readonly storageService: StorageService,
        private readonly companyService: CompanyService
    ) {}

    currentPage: string = ''

    initActiveUsers() {
        this.currentPage = this.router.url
    }

    setFirstLetterOfName(value: string): string {
        if (value && value.length > 0) {
            return value.split('')[0]
        }

        return value
    }

    refreshComponent(navigateTo?: string): void {
        if (!navigateTo) {
            navigateTo = this.router.url
        }

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([`/${navigateTo}`])
        })
    }

    changeSystemLang(lang: string) {
        this.translateService.use(lang)
        this.translateService.get('primeng').subscribe({
            next: (translation: any) => {
                this.primeNGConfig.setTranslation(translation)
            }
        })
    }

    handleError(response: HttpErrorResponse): void {
        if (isDevMode()) {
            console.error(response)
        }

        const details = response.error.detailsErrorPath
            ? this.translateService.instant(response.error.detailsErrorPath)
            : response.statusText

        if (response.error.titleErrorPath) {
            const title = this.translateService.instant(response.error.titleErrorPath)

            this.messageService.add({
                severity: 'error',
                summary: title,
                detail: details
            })
        } else if (response.error.message) {
            this.messageService.add({
                severity: 'error',
                summary: response.error.message,
                detail: details,
                life: 9000
            })
        }
    }

    toggleTheme() {
        const currentUser = this.userService.currentUser
        switch (currentUser.info.theme.mode) {
            case 'dark': {
                currentUser.info.theme.mode = 'light'
                break
            }
            case 'light': {
                currentUser.info.theme.mode = 'dark'
                break
            }
        }

        this.setTheme(currentUser.info.theme.mode)

        this.userService.updateOne(currentUser).subscribe({
            next: async () => {
                await this.userService.init()
            }
        })
    }

    setTheme(theme: string) {
        const themeLink = this.document.getElementById('app-theme') as HTMLLinkElement

        if (themeLink) {
            themeLink.href = (theme || 'dark') + '-theme.css'
        }

        this.storageService.updateState('themeMode', theme)
    }

    setUserTheme() {
        let theme!: string
        if (this.userService.currentUser) {
            theme = this.userService.currentUser.info.theme.mode
        } else {
            theme = this.storageService.getStateElement('themeMode')
        }

        this.setTheme(theme)
    }

    avatarLabel(user: any = this.userService.currentUser): string | any {
        if (!user) {
            return
        }

        if (user.avatar?.url) {
            return undefined
        }

        return this.setFirstLetterOfName(this.userService.currentUser.name.first)
    }

    forceReload() {
        this.userService.logout()
        this.companyService.logout()

        this.cookieService.deleteAll()
        localStorage.clear()
        window.location.reload()
        this.logout()
    }

    logout() {
        this.userService.logout()
        this.companyService.logout()

        this.cookieService.deleteAll('/')
        localStorage.removeItem('systemData')
        this.router.navigateByUrl('/')
    }
}
