import { IUser } from '@globalInterfaces/user.interface'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { hasCollectionRight, hasSystemRight } from '@globalShared/utils/system.utils'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private readonly httpClient: HttpClient) {}
    currentUser!: IUser
    users!: IUser[]

    async init() {
        if (!this.currentUser ?? !this.users) {
            try {
                const { currentUser, users } = (await lastValueFrom(
                    this.httpClient.get(`${environment.serverApiUrl}/users`)
                )) as { currentUser: IUser; users: IUser[] }

                this.currentUser = currentUser
                this.users = users

                return !!this.currentUser && !!this.users
            } catch (e) {
                return false
            }
        } else {
            return true
        }
    }

    get usersWithoutCurrent(): any[] {
        return this.users.filter((user: any) => user._id !== this.currentUser._id)
    }

    getUserById(id: string): any {
        return this.users.find((user: any) => user._id === id)
    }

    updateOne(user: any): Observable<any> {
        return this.httpClient.patch(`${environment.serverApiUrl}/users/${user._id}`, user)
    }

    hasSystemRight(config: {
        rightPath: string
        rights: any
        mustEqualTo?: any
        mustNotEqualTo?: any
    }) {
        if (!config.rights) {
            config.rights = this.currentUser.rights.system
        }

        return hasSystemRight(config)
    }

    hasCollectionRight(config: {
        collectionId: any
        rights: any
        right: any
        mustEqualTo?: any
        mustNotEqualTo?: any
    }) {
        return hasCollectionRight(config)
    }

    inviteUsers(data: { emails: any[]; rights: { system: any; collections: any } }) {
        return this.httpClient.post(`${environment.serverApiUrl}/users/invite`, data)
    }

    logout() {
        this.currentUser = null as any
        this.users = []
    }
}
