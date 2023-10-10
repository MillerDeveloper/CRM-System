import { AuthService } from '@/shared/services/auth/auth.service'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { Md5 } from 'ts-md5'
import { TOKEN_EXPIRE } from '@globalShared/constants/system.constants'
import { SystemService } from '@/shared/services/system/system.service'
import { UserService } from '@/shared/services/user/user.service'

interface IAuthState {
    isSendMail: boolean
    isVerifiedCode: boolean
    userCreated: boolean
    isInvitedUser?: boolean
}

interface IInviteConfig {
    userId: string
    companyId: string
    workspaceName: string
    email: string
}

interface IRegisterResponse {
    user: {
        name: {
            first: string
            last: string
            full: string
        }
        email: string
    }
    company: {
        _id: string
        name: string
        workspaceName: string
    }
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly cookieService: CookieService,
        private readonly systemService: SystemService
    ) {}

    state: IAuthState = {
        isSendMail: false,
        isVerifiedCode: false,
        userCreated: false,
        isInvitedUser: false
    }
    inviteConfig!: IInviteConfig
    firstLetterOfName: string = ''
    isTrial: boolean = false

    authForm: FormGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        verificationCode: new FormControl(null),
        firstName: new FormControl(null),
        lastName: new FormControl(null),
        password: new FormControl(null),
        passwordConfirm: new FormControl(null),
        companyName: new FormControl(null),
        companyRef: new FormControl(null),
        workspaceName: new FormControl(null)
    })

    // http://localhost:4200/register?isInvite=true&amp;companyId=63e218f134e048b5997b6834&amp;workspaceName=BCS&amp;userId=63e7c166fa87adfd06975bc4
    ngOnInit(): void {
        const queryParams: any = this.route.snapshot.queryParamMap
        if (queryParams.get('isInvite')) {
            this.state.isVerifiedCode = true
            this.state.isSendMail = true
            this.state.isInvitedUser = true
            this.inviteConfig = {
                companyId: queryParams.get('companyId'),
                userId: queryParams.get('userId'),
                workspaceName: queryParams.get('workspaceName'),
                email: queryParams.get('email')
            }

            this.authForm.patchValue({
                email: this.inviteConfig.email,
                workspaceName: this.inviteConfig.workspaceName,
                companyRef: this.inviteConfig.companyId
            })
        } else if (queryParams.get('isTrial')) {
            this.isTrial = true
        }
    }

    nextStep() {
        if (!this.state.isSendMail) {
            this.verifyEmail()
        } else if (!this.state.isVerifiedCode) {
            this.verifyCode()
        } else if (this.state.isVerifiedCode && !this.state.userCreated) {
            this.state.userCreated = true

            if (this.state.isInvitedUser) {
                this.register()
            } else {
                this.authForm.get('companyName')?.setValidators(Validators.required)
                this.authForm.get('companyId')?.setValidators(Validators.required)
            }
        } else if (this.state.userCreated) {
            this.register()
        }
    }

    verifyEmail() {
        this.authService.verifyEmail(this.authForm.value.email).subscribe({
            next: () => {
                this.state.isSendMail = true
                this.authForm.get('code')?.setValidators(Validators.required)
                this.authForm.get('email')?.disable()
            },
            error: () => this.authForm.reset()
        })
    }

    verifyCode() {
        this.authService
            .verifyEmailCode({
                email: this.authForm.get('email')?.value,
                verificationCode: this.authForm.get('verificationCode')?.value
            })
            .subscribe({
                next: () => {
                    this.state.isVerifiedCode = true

                    this.authForm.get('firstName')?.setValidators(Validators.required)
                    this.authForm.get('lastName')?.setValidators(Validators.required)
                    this.authForm
                        .get('password')
                        ?.setValidators([Validators.required, Validators.minLength(6)])
                    this.authForm
                        .get('passwordConfirm')
                        ?.setValidators([Validators.required, Validators.minLength(6)])
                },
                error: () => {
                    this.authForm.reset()
                    this.authForm.enable()
                    this.state.isSendMail = false
                }
            })
    }

    setFirstLetterOfName() {
        if (this.authForm.value.firstName.length > 0) {
            this.firstLetterOfName = this.systemService.setFirstLetterOfName(
                this.authForm.value.firstName
            )
        }
    }

    register() {
        if (
            this.authForm.value.password === this.authForm.value.passwordConfirm &&
            this.authForm.value.password.length >= 6
        ) {
            this.authForm.disable()
            const password = Md5.hashStr(this.authForm.value.password)
            this.authForm.patchValue({
                password: password,
                passwordConfirm: password
            })

            this.authService.register({ ...this.authForm.value, isTrial: this.isTrial }).subscribe({
                next: (response: IRegisterResponse) => {
                    this.cookieService.set(
                        'systemData',
                        JSON.stringify(
                            {
                                selectedCompanyId: response.company._id,
                                workspaceName: response.company.workspaceName
                            },
                            TOKEN_EXPIRE as any
                        )
                    )

                    localStorage.setItem('userInfo', JSON.stringify(response.user))
                    this.authForm.enable()
                    this.router.navigate(['/login'])
                },
                error: () => {
                    this.state = {
                        isSendMail: false,
                        isVerifiedCode: false,
                        userCreated: false
                    }

                    this.authForm.reset()
                    this.authForm.enable()
                }
            })
        } else {
            this.authForm.enable()
            this.state.userCreated = false
        }
    }
}
