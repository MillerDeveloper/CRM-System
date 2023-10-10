import { DEFAULT_USER_FIELDS } from './../shared/constants/db.constants'
import { DBService } from './../services/global/db.service'
import moment from 'moment'
import { Types } from 'mongoose'

export async function getUserFromDistribution(config: { distribution: any; requestData: any }) {
    let users = config.distribution.users
    let selectedUser: any = null

    switch (config.distribution.method) {
        case 'queue': {
            users = users.sort((a: any, b: any) => {
                if (moment(a.lastRecordAt).isAfter(moment(b.lastRecordAt))) {
                    return 1
                } else if (moment(a.lastRecordAt).isBefore(moment(b.lastRecordAt))) {
                    return -1
                }

                return 0
            })

            selectedUser = users[0]
        }
        case 'random': {
            const index = Math.random() * users.length
            selectedUser = users[index]
        }
    }

    const userService = new DBService({
        connection: config.requestData,
        schemaName: 'User'
    })

    if (selectedUser) {
        return await userService
            .findOne({ _id: new Types.ObjectId(selectedUser.data) })
            .select(DEFAULT_USER_FIELDS)
    } else {
        return await userService
            .findOne({ _id: new Types.ObjectId(users[0].data) })
            .select(DEFAULT_USER_FIELDS)
    }
}
