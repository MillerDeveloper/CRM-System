import { SystemService } from './shared/services/system/system.service'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { Component, HostListener, OnInit, isDevMode } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { DEFAULT_LANG, SYSTEM_LANGS } from '@globalShared/constants/system.constants'
import { SwUpdate } from '@angular/service-worker'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private readonly translateService: TranslateService,
        private readonly systemService: SystemService,
        private readonly router: Router,
        private readonly swUpdate: SwUpdate
    ) {}

    @HostListener('document:DOMContentLoaded', ['$event'])
    onDomContentLoaded(event: Event) {
        if (this.isOnline) {
            if (this.loadingSeconds < 2) {
                setTimeout(() => (this.loadingConfig.isLoadingData = false), 2000)
            } else {
                this.loadingConfig.isLoadingData = false
            }
        }
    }

    loadingSeconds: number = 0
    isOnline: boolean = true
    lang!: string | undefined
    loadingInterval!: any
    loadingConfig: ILoadingConfig = {
        isLoadingData: true
    }

    ngOnInit(): void {
        this.initTranslate()
        this.systemService.setUserTheme()

        if (this.isOnline) {
            if (this.swUpdate.isEnabled) {
                this.swUpdate.versionUpdates.subscribe((evt) => {
                    switch (evt.type) {
                        case 'VERSION_READY': {
                            this.swUpdate.activateUpdate().then(() => {
                                document.location.reload()
                            })

                            break
                        }
                    }
                })
            }

            this.loadingInterval = setInterval(() => {
                this.loadingSeconds++

                if (!this.loadingConfig.isLoadingData) {
                    clearInterval(this.loadingInterval)
                }
            }, 1000)
        } else {
            if (location.pathname !== '/login') {
                this.router.navigateByUrl('/login')
            }
        }
    }

    initTranslate() {
        // const browserLang = this.translateService.getBrowserLang()
        // this.lang = browserLang?.match(/ru|uk|en|cs/) ? browserLang : DEFAULT_LANG
        this.isOnline = navigator.onLine
        this.translateService.addLangs(SYSTEM_LANGS)
        this.translateService.setDefaultLang(DEFAULT_LANG)
        // this.systemService.changeSystemLang(this.lang)
    }
}
