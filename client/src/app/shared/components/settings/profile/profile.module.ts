import {ReactiveFormsModule} from '@angular/forms'
import {DropdownModule} from 'primeng/dropdown'
import {InputTextModule} from 'primeng/inputtext'
import {ButtonModule} from 'primeng/button'
import {TranslateModule} from '@ngx-translate/core'
import {AvatarModule} from 'primeng/avatar'
import {UploadButtonModule} from '@/shared/components/widgets/upload-button/upload-button.module'
import {DividerModule} from 'primeng/divider'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    DividerModule,
    UploadButtonModule,
    AvatarModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
