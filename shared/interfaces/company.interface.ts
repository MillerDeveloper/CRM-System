export interface ICompany {
    _id: any
    name: string
    collections: [{
        element: any
    }],
    settings: {
        users: {
            departments: any[]
        }
    }
    integrations: {
        binotel: {
            key: string,
            secret: string
            callNumberType: string,
            companyId: string
        }
        novaposhta: {
            key: string
        },
        telegram: {
            key: string,
            welcomeMessage: string
        }
    }
}
