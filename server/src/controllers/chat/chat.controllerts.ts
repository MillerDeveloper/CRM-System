import { DBService, defaultFetchConfig } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { DEFAULT_USER_FIELDS } from '@/shared/constants/db.constants'
import { getModelFilter, isJson } from '@globalShared/utils/system.utils'
import { Types } from 'mongoose'

const router = Router()

const populate: any[] = [
    {
        path: 'chatWith',
        populate: {
            path: 'data',
            select: DEFAULT_USER_FIELDS
        }
    },
    {
        path: 'createdBy',
        populate: {
            path: 'data',
            select: DEFAULT_USER_FIELDS
        }
    }
]

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const chatService = new DBService({
                connection: req.user,
                schemaName: 'Chat',
                registerSchemas: ['User', 'Message']
            })

            const filter = chatService.getFilters(
                {
                    $or: [
                        {
                            ['chatWith.data']: {
                                $in: [req.user.userId]
                            }
                        },
                        { ['createdBy.data']: req.user.userId }
                    ]
                },
                req.query
            )

            const chats = await chatService.findMany(filter, {
                populate: populate,
                query: req.query
            })

            res.status(200).json({
                chats: chats
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/:chatId/messages',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const messageService = new DBService({
                connection: req.user,
                schemaName: 'Message',
                registerSchemas: ['Chat']
            })

            const filter = getModelFilter(req.query, {
                chatRef: new Types.ObjectId(req.params.chatId)
            })
            const fetchConfigQuery: any = req.query.fetchConfig
            const fetchConfig = isJson(fetchConfigQuery)
                ? JSON.parse(fetchConfigQuery)
                : defaultFetchConfig

            const groups = await messageService.aggregate([
                { $match: filter },
                { $sort: { createdAt: -1 } },
                { $skip: fetchConfig.page * fetchConfig.rows },
                { $limit: fetchConfig.rows },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdBy'
                    }
                },
                {
                    $lookup: {
                        from: 'messages',
                        localField: 'answerTo',
                        foreignField: '_id',
                        as: 'answerTo'
                    }
                },
                {
                    $unwind: {
                        path: '$createdBy',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: '$answerTo',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            identifier: {
                                $dateToString: {
                                    format: '%Y-%m-%d',
                                    date: '$createdAt'
                                }
                            }
                        },
                        messages: {
                            $push: {
                                _id: '$_id',
                                text: '$text',
                                createdAt: '$createdAt',
                                updatedAt: '$updatedAt',
                                createdBy: {
                                    _id: '$createdBy._id',
                                    name: '$createdBy.name',
                                    email: '$createdBy.email'
                                },
                                companyRef: '$companyId',
                                answerTo: '$answerTo'
                            }
                        }
                    }
                },
                {
                    $project: {
                        period: '$_id',
                        messages: { $reverseArray: '$messages' },
                        _id: 0
                    }
                }
            ])

            const messagesGroups = groups.sort((a: any, b: any) => {
                if (a.period.identifier < b.period.identifier) {
                    return 1
                } else if (a.period.identifier > b.period.identifier) {
                    return -1
                }

                return 0
            })

            return res.status(200).json({
                messagesGroups: messagesGroups
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    '/:chatId/messages',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            if (Types.ObjectId.isValid(req.params.chatId)) {
                const { text, messageType, fileType, answerTo } = req.body
                const messageService = new DBService({
                    connection: req.user,
                    schemaName: 'Message',
                    registerSchemas: ['Chat']
                })

                const data = {
                    text,
                    messageType,
                    fileType,
                    answerTo,
                    chatRef: req.params.chatId,
                    createdBy: {
                        data: req.user.userId
                    },
                    companyRef: req.user.companyId,
                    workspaceName: req.user.workspaceName
                }

                const message = await messageService.create(data)
                res.status(200).json({
                    message: message
                })
            } else {
                res.status(400).json({
                    message: 'Invalid chat Id'
                })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const { name, chatType, mode, connection, collectionRef, chatWith } = req.body
            const chatService = new DBService({
                connection: req.user,
                schemaName: 'Chat'
            })

            const data = {
                name,
                chatType,
                connection,
                chatWith,
                mode,
                createdBy: {
                    data: req.user.userId
                },
                companyRef: req.user.companyId,
                workspaceName: req.user.workspaceName
            }

            const chat = await chatService.create(data)
            res.status(200).json({ message: 'Success', chat: chat })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.patch(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const { _id, title, startAt, endAt, stage, responsibles, connections } = req.body
            const taskService = new DBService({
                connection: req.user,
                schemaName: 'Task'
            })

            const data = {
                title,
                startAt,
                endAt,
                responsibles,
                connections,
                stage
            }
            const filter = {
                _id: new Types.ObjectId(_id)
            }

            const task = await taskService.updateOne(filter, data)
            res.status(200).json({ message: 'Success', task: task })
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
            const taskService = new DBService({
                connection: req.user,
                schemaName: 'Task'
            })

            const ids = req.params.ids?.split('|')

            if (ids?.length > 0) {
                await taskService.deleteMany({
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
