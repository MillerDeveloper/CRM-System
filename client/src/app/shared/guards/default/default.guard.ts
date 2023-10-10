import { CompanyService } from '@/shared/services/company/company.service'
import { SystemService } from '@/shared/services/system/system.service'
import { UserService } from '@/shared/services/user/user.service'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'

@Injectable({
    providedIn: 'root'
})
export class DefaultGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly companyService: CompanyService,
        private readonly router: Router,
        private readonly cookieService: CookieService,
        private readonly systemService: SystemService
    ) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const resultInit = (await this.userService.init()) && (await this.companyService.init())

        if (resultInit) {
            const currentUser = this.userService.currentUser
            const userLang = currentUser.info.language.code
            this.systemService.changeSystemLang(userLang)
            return true
        } else {
            this.systemService.logout()
            return false
        }
    }
}
