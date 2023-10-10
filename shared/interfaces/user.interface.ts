import { ICompany } from './company.interface'
export interface IUser {
    _id: any
    email: string
    avatar: {
        url: string | undefined
        fileRef: string | undefined
    }
    name: {
        first: string
        last: string
        full: string
    }
    workspaceName: string
    companies: {
        element: any | ICompany
        addedAt: Date
    }[]

    info: {
        theme: {
            mode: string
        }
        language: {
            code: string
        }
    }
    rights: {
        system: any
        collections: any[]
    }
}
