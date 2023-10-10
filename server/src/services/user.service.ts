import UserSchema from '@/models/user.model'
import { Connection, Model } from 'mongoose'
import { IUser } from '@globalInterfaces/user.interface'

export class UserService {
    connection!: Connection
    schema!: Model<any>

    constructor(config: { connection: Connection }) {
        this.connection = config.connection
        this.schema = this.connection.model('User', UserSchema)
    }

    create(data: IUser) {
        return this.schema.create(data)
    }
}