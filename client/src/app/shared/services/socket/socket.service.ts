import { CompanyService } from './../company/company.service'
import { UserService } from './../user/user.service'
import { Injectable } from '@angular/core'
import { io } from 'socket.io-client'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    constructor(
        private readonly userService: UserService,
        private readonly companyService: CompanyService
    ) {}

    private readonly socketServer = io(environment.serverUrl, {
        transports: ['websocket', 'polling'],
        secure: environment.production
    })

    get socket() {
        return this.socketServer
    }

    on(event: string, callback: any) {
        return this.socketServer.on(event, callback)
    }

    emit(event: string, data: any) {
        if (this.userService.currentUser && this.companyService.currentCompany) {
            const workspaceInfo = {
                userId: this.userService.currentUser._id,
                companyId: this.companyService.currentCompany._id,
                workspaceName: this.userService.currentUser.workspaceName
            }

            this.socket.emit(event, {
                data: data,
                info: workspaceInfo
            })
        }
    }
}
