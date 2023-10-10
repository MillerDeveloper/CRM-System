import { UserService } from '@/shared/services/user/user.service'
import { FormControl, FormGroup } from '@angular/forms'
import { SYSTEM_LANGS } from '@globalShared/constants/system.constants'
import { Component, OnInit } from '@angular/core'
import { ILoadingConfig } from '@/shared/interfaces/global.interface'
import { FileService } from '@/shared/services/file/file.service'
import { SystemService } from '@/shared/services/system/system.service'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    constructor(
        private readonly userService: UserService,
        public readonly fileService: FileService,
        public readonly systemService: SystemService
    ) {}

    langs: string[] = SYSTEM_LANGS
    currentUser: any = this.userService.currentUser
    userTimeout!: any
    loadingConfig: ILoadingConfig = {
        isLoadingData: false
    }
    userForm: FormGroup = new FormGroup({
        name: new FormGroup({
            first: new FormControl(null),
            last: new FormControl(null)
        }),
        email: new FormControl({ value: null, disabled: true }),
        info: new FormGroup({
            language: new FormGroup({
                code: new FormControl(null)
            })
        })
    })

    ngOnInit(): void {
        this.setView()
        this.userForm.valueChanges.subscribe({
            next: () => {
                if (this.loadingConfig.isLoadingData === false) {
                    clearTimeout(this.userTimeout)
                    this.userTimeout = setTimeout(() => {
                        const data = this.userForm.value
                        delete data.email
                        data.name.full = `${data.name.first} ${data.name.last}`
                        this.currentUser.info.language = data.info.language
                        this.currentUser.name = data.name
                        this.updateUser()
                    }, 500)
                }
            }
        })
    }

    setView() {
        this.userForm.patchValue(this.currentUser)
        this.loadingConfig.isLoadingData = false
    }

    uploadAvatar(formData: FormData) {
        this.loadingConfig.isLoadingData = true
        this.fileService.upload(formData, { id: this.currentUser._id }).subscribe({
            next: async (response: { files: any }) => {
                const fileAvatar = response.files[0]

                this.currentUser.avatar = {
                    fileRef: fileAvatar._id,
                    url: this.fileService.getFileUrl(fileAvatar._id)
                }
                this.updateUser()
            }
        })
    }

    removeAvatar() {
        this.fileService.deleteOne(this.currentUser.avatar.fileRef).subscribe({
            next: () => {
                this.currentUser.avatar.url = ''
                this.updateUser()
            }
        })
    }

    updateUser() {
        this.loadingConfig.isLoadingData = true
        this.userService.updateOne(this.currentUser).subscribe({
            next: () => {
                this.setView()
            }
        })
    }
}
