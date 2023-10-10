import { TranslateModule } from '@ngx-translate/core'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AuthRoutingModule } from './auth-routing.module'
import { AuthComponent } from './auth.component'
import { LoginComponent } from '@/modules/auth/login/login.component'
import { RegisterComponent } from '@/modules/auth/register/register.component'
import { InputTextModule } from 'primeng/inputtext'
import { ButtonModule } from 'primeng/button'
import { ReactiveFormsModule } from '@angular/forms'
import { AvatarModule } from 'primeng/avatar'
import { FileUploadModule } from 'primeng/fileupload'
import { PasswordModule } from 'primeng/password'
import { InputMaskModule } from 'primeng/inputmask'
import { UploadButtonModule } from '@/shared/components/widgets/upload-button/upload-button.module'
import { KeyFilterModule } from 'primeng/keyfilter'

@NgModule({
    declarations: [AuthComponent, LoginComponent, RegisterComponent],
    imports: [
        CommonModule,
        AuthRoutingModule,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
        AvatarModule,
        FileUploadModule,
        PasswordModule,
        InputMaskModule,
        UploadButtonModule,
        TranslateModule,
        KeyFilterModule
    ]
})
export class AuthModule {}
