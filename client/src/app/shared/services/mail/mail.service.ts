import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class MailService {
    constructor(private readonly httpClient: HttpClient) {}

    findAll(fetchConfig: any = {}, config: { service: string; email: string }): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/integrations/mail/${config.service}/${config.email}`,
            {
                params: new HttpParams({
                    fromObject: fetchConfig
                })
            }
        )
    }

    getAuthUrl(): Observable<any> {
        return this.httpClient.get(`${environment.serverApiUrl}/integrations/mail/gmail/auth/url`)
    }

    setCredentials(code: string): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/integrations/mail/gmail/auth/setCredentials?code=${code}`
        )
    }

    updateOne(message: any, config: { service: string; email: string }) {
        return this.httpClient.patch(
            `${environment.serverApiUrl}/integrations/mail/${config.service}/${config.email}/${message.id}`,
            message
        )
    }

    sendEmail(data: any) {
        return this.httpClient.post(
            `${environment.serverApiUrl}/integrations/mail/gmail/sendEmail`,
            data
        )
    }
}
