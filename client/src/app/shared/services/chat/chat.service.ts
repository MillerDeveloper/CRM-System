import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private readonly httpClient: HttpClient) {}

    findAll(filter: any): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/chats?filter=${JSON.stringify(filter)}`
        )
    }

    findOne(id: string) {
        return this.httpClient.get(`${environment.serverApiUrl}/chats/${id}`)
    }

    createChat(data: any): Observable<any> {
        return this.httpClient.post(`${environment.serverApiUrl}/chats`, data)
    }

    findAllMessages(chatId: string, filter: any): Observable<any> {
        return this.httpClient.get(`${environment.serverApiUrl}/chats/${chatId}/messages?fetchConfig=${JSON.stringify(filter)}`)
    }

    createMessage(chatId: string, data: any): Observable<any> {
        return this.httpClient.post(`${environment.serverApiUrl}/chats/${chatId}/messages`, data)
    }
}
