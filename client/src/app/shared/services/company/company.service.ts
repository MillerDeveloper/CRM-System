import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ICompany } from '@globalShared/interfaces/company.interface'
import { environment } from 'src/environments/environment'
import { lastValueFrom, Observable } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    constructor(private readonly httpClient: HttpClient) {}
    currentCompany!: ICompany

    async init() {
        if (!this.currentCompany) {
            try {
                const { currentCompany } = (await lastValueFrom(
                    this.httpClient.get(`${environment.serverApiUrl}/companies/currentCompany`)
                )) as { currentCompany: ICompany }

                this.currentCompany = currentCompany
                return !!this.currentCompany
            } catch (e) {
                return false
            }
        } else {
            return true
        }
    }

    updateOne(company: any): Observable<any> {
        return this.httpClient.patch(`${environment.serverApiUrl}/companies`, company)
    }

    getUserDepartments(departments: any) {
        const groupedDepartments: any[] = []

        if (this.currentCompany.settings?.users?.departments) {
            const companyDepartments = this.currentCompany.settings.users.departments
            departments.forEach((department: any) => {
                const index = companyDepartments.findIndex(
                    (dp: any) => dp._id === department.departmentRef
                )

                if (index !== -1) {
                    groupedDepartments.push(companyDepartments[index])
                }
            })
        }

        return groupedDepartments
    }

    logout() {
        this.currentCompany = null as any
    }
}
