import { IUser } from "@globalShared/interfaces/user.interface"

export const testObjectId = '64830cf95b128b2096a44a71'

export const testUser: IUser = {
    _id: testObjectId,
    email: 'testmail@gmail.com',
    avatar: {
        url: undefined,
        fileRef: undefined
    },
    name: {
        first: 'Test',
        last: 'Bed',
        full: 'Test Bed'
    },
    workspaceName: 'Test',
    companies: [],
    info: {
        theme: {
            mode: 'dark'
        },
        language: {
            code: 'en'
        }
    },
    rights: {
        system: {},
        collections: []
    }
}

export const testCollection = {
    _id: testObjectId,
    label: {
        text: 'Test collection',
        icon: 'pi-bolt',
        iconType: 'icon'
    },
    description: '',
    workspaceName: 'Test'
}
