import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class DeliveryService {
    constructor(private readonly httpClient: HttpClient) {}

    findAll(filter: any): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/deliveries?filter${JSON.stringify(filter)}`
        )
    }

    create(data: any): Observable<any> {
        return this.httpClient.post(`${environment.serverApiUrl}/deliveries`, data)
    }

    deleteMany(ids: string[]): Observable<any> {
        return this.httpClient.delete(
            `${environment.serverApiUrl}/deliveries/${ids.join('|')}`
        )
    }

    deleteOne(id: string): Observable<any> {
        return this.deleteMany([id])
    }
}
