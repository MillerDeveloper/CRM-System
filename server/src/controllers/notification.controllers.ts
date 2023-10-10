import { Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { getModelFilter } from '@globalShared/utils/system.utils'
import webPush from 'web-push'
import { PushNotificationService } from '@services/global/push-notification.service'
import moment from 'moment'
import { environment } from '@/shared/enviroment'
import { RESPONSIBLES_POPULATE } from '@/shared/constants/db.constants'

const router = Router()
const populate = [
    {
        path: 'connection',
        populate: {
            path: 'to'
        }
    },
    RESPONSIBLES_POPULATE
]

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const notificationService = new DBService({
                connection: req.user,
                schemaName: 'Notification',
                registerSchemas: ['Task', 'CollectionElement', 'User']
            })

            const filter = getModelFilter(req.query, {
                notifyAt: {
                    $lte: moment().add(1, 'day').endOf('day')
                }
            })
            const notifications = await notificationService.findMany(filter, {
                populate: populate,
                query: req.query
            })

            const pushNotificationsService = new PushNotificationService()
            for (const notification of notifications) {
                const users: [{ data: any; isNotified: boolean }] = notification.responsibles
                const payload = {
                    notification: {
                        title: notification.title,
                        body: 'Notification from BCS',
                        actions: [{ action: 'openCrm', title: 'To CRM' }],
                        data: {
                            onActionClick: {
                                default: { operation: 'openWindow' },
                                openCrm: {
                                    operation: 'focusLastFocusedOrOpen',
                                    url: environment.clientUrl
                                }
                            }
                        }
                    }
                }

                for (let i = 0; i < users.length; i++) {
                    const settings = users[i].data?.settings?.notifications

                    if (!users[i].isNotified && settings && settings.push?.subscription) {
                        await pushNotificationsService.sendNotification(
                            settings.push.subscription,
                            payload
                        )

                        await notificationService.updateOne(
                            { _id: new Types.ObjectId(notification._id) },
                            {
                                $set: {
                                    [`responsibles.${i}.isNotified`]: true
                                }
                            }
                        )
                    }
                }
            }

            res.status(200).json({
                notifications: notifications
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    '/push/subscribe',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const { subscription } = req.body
            const userService = new DBService({ connection: req.user, schemaName: 'User' })
            await userService.updateOne(
                { _id: new Types.ObjectId(req.user.userId) },
                {
                    $set: {
                        ['settings.notifications.push.subscription']: subscription
                    }
                }
            )

            res.status(200).json({ message: 'Success' })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.delete(
    '/:ids',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const notificationService = new DBService({
                connection: req.user,
                schemaName: 'Notification'
            })

            const ids = req.params.ids?.split('|')

            if (ids?.length > 0) {
                await notificationService.deleteMany({
                    _id: {
                        $in: ids
                    }
                })

                res.status(200).json({ message: 'Success' })
            } else {
                res.status(400).json({ message: 'Ids are invalid' })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router
