import { SystemService } from '@/shared/services/system/system.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '@/shared/services/auth/auth.service'
import { Md5 } from 'ts-md5'
import { CookieService } from 'ngx-cookie-service'
import { ICompany } from '@globalInterfaces/company.interface'
import { TOKEN_EXPIRE } from '@globalShared/constants/system.constants'
import { MessageService } from 'primeng/api'

interface ILoginResponse {
    token?: string
    user?: {
        email: string
        name: {
            first: string
            last: string
            full: string
        }
        workspaceName: string
    }
    state?: 'selectCompany' | 'hasNoRight'
    companies?: [
        {
            element: ICompany
        }
    ]
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
        private readonly systemService: SystemService
    ) {}

    authForm: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required]),
        workspaceName: new FormControl(null, [Validators.required]),
        selectedCompanyId: new FormControl(null)
    })

    companies: any[] = []
    systemData: any = {}
    state = {
        isSelectCompany: false
    }

    ngOnInit(): void {
        if (
            this.cookieService.check('token') &&
            !this.route.snapshot.queryParamMap.get('autologin')
        ) {
            this.router.navigate(['collection'], {
                queryParams: {
                    autologin: true
                }
            })
        }

        if (this.cookieService.check('systemData')) {
            this.systemData = JSON.parse(this.cookieService.get('systemData'))
        }
    }

    login() {
        this.authForm.disable()
        const password = Md5.hashStr(this.authForm.value.password)
        const oldPassword = this.authForm.value.password

        const userData = {
            ...this.authForm.value,
            password: password,
            selectedCompanyId: this.systemData?.selectedCompanyId
        }

        this.authService.login(userData).subscribe({
            next: (response: ILoginResponse) => {
                if (response.state) {
                    switch (response.state) {
                        case 'selectCompany': {
                            this.companies = response.companies ?? []

                            if (this.companies.length === 1) {
                                this.selectCompany(this.companies[0])
                            } else {
                                this.state.isSelectCompany = true
                            }

                            break
                        }
                        case 'hasNoRight': {
                            this.cookieService.deleteAll()
                            localStorage.clear()
                            break
                        }
                    }
                } else if (response.token) {
                    this.cookieService.set('token', response.token, {
                        path: '/',
                        expires: TOKEN_EXPIRE,
                        sameSite: 'Lax'
                    })
                    this.router.navigate(['collection'])
                }

                this.authForm.enable()
            },
            error: (error: any) => {
                this.systemService.handleError(error)
                this.authForm.enable()
                this.authForm.patchValue({
                    password: oldPassword
                })
            }
        })
    }

    selectCompany(company: { element: ICompany }) {
        this.systemData.selectedCompanyId = company.element._id
        this.authForm.patchValue({ selectedCompanyId: this.systemData.selectedCompanyId })
        localStorage.setItem('systemData', JSON.stringify(this.systemData))
        this.login()
    }
}
