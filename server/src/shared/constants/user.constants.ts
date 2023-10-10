export const TRIAL_USER_RIGHTS: any = {
    system: {
        access: {
            entrance: true
        },
        modules: {
            tasks: {
                create: true,
                view: 'allowed',
                edit: 'allowed',
                complete: 'allowed',
                delete: 'allowed'
            },
            settings: {
                createCompany: true,
                settingCompany: true,
                users: {
                    invite: false,
                    create: false,
                    view: 'forbidden',
                    delete: 'forbidden'
                },
                integrations: {
                    edit: 'allowed'
                },
                sites: {
                    edit: 'allowed'
                }
            },
            collections: {
                create: true,
                view: 'allowed',
                edit: 'allowed',
                delete: 'allowed'
            },
            analytics: {
                view: 'allowed'
            },
            mail: {
                send: true,
                view: 'allowed',
                delete: 'allowed'
            },
            files: {
                upload: true,
                view: 'allowed',
                delete: 'allowed'
            },
            deliveries: {
                create: true,
                view: 'allowed',
                delete: 'allowed'
            },
            calls: {
                create: true,
                view: 'allowed',
                delete: 'allowed'
            }
        }
    },
    collections: []
}
