import webpush from 'web-push'
import { vapidKeys } from '@globalShared/constants/system.constants'

export class PushNotificationService {
    constructor() {}

    sendNotification(subscription: any, payload: any): Promise<any> {
        const options = {
            vapidDetails: {
                publicKey: vapidKeys.public,
                privateKey: vapidKeys.private
            },
            TTL: 60
        }

        return webpush.sendNotification(subscription, JSON.stringify(payload), options)
    }
}
