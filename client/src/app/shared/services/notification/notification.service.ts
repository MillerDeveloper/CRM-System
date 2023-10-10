import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    constructor(private readonly httpClient: HttpClient) {}

    findAll(filter: any = {}): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/notifications?filter=${JSON.stringify(filter)}`
        )
    }

    deleteMany(ids: string[]): Observable<any> {
        return this.httpClient.delete(`${environment.serverApiUrl}/notifications/${ids.join('|')}`)
    }

    deleteOne(id: string): Observable<any> {
        return this.deleteMany([id])
    }

    subscribePushNotification(subscription: any) {
        return this.httpClient.post(`${environment.serverApiUrl}/notifications/push/subscribe`, {
            subscription
        })
    }
}
