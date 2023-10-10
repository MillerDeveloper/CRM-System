import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    constructor(private readonly httpClient: HttpClient) {}

    findAll(filter: any = {}): Observable<any> {
        return this.httpClient.get(
            `${environment.serverApiUrl}/tasks?filter=${JSON.stringify(filter)}`
        )
    }

    create(data: any): Observable<any> {
        return this.httpClient.post(`${environment.serverApiUrl}/tasks`, data)
    }

    update(data: any): Observable<any> {
        return this.httpClient.patch(`${environment.serverApiUrl}/tasks`, data)
    }

    deleteMany(ids: string[]): Observable<any> {
        return this.httpClient.delete(`${environment.serverApiUrl}/tasks/${ids.join('|')}`)
    }

    deleteOne(id: string): Observable<any> {
        return this.deleteMany([id])
    }

    getCountConnectedElements(connections: any[]): number {
        return connections.reduce((acc: any, connection: any) => {
            acc += connection.elements.length
            return acc
        }, 0)
    }
}
