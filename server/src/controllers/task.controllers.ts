import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { CONNECTION_POPULATE, DEFAULT_USER_FIELDS, RESPONSIBLES_POPULATE } from '@/shared/constants/db.constants'
import { getModelFilter } from '@globalShared/utils/system.utils'
import moment from 'moment'
import { Types } from 'mongoose'

const router = Router()

const populate = [CONNECTION_POPULATE, RESPONSIBLES_POPULATE, {
    path: 'executors',
    populate: {
        path: 'data',
        select: DEFAULT_USER_FIELDS
    }
}]

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const taskService = new DBService({
                connection: req.user,
                schemaName: 'Task',
                registerSchemas: ['Collection', 'CollectionElement', 'User']
            })

            const userId = new Types.ObjectId(req.user.userId)
            const filter = getModelFilter(req.query, {
                $or: [
                    {
                        executors: {
                            $in: [userId]
                        }
                    },
                    {
                        responsibles: {
                            $in: [userId]
                        }
                    },
                    {
                        createdBy: userId
                    }
                ]
            })

            const tasks = await taskService.findMany(filter, {
                populate: populate,
                query: req.query
            })

            const groupedTasks = sortGroupedTasks(
                tasks.reduce((acc: any, task: any) => {
                    if (moment(task.endAt).isValid()) {
                        if (task.stage.progress !== 'completed') {
                            switch (task.period) {
                                case 'today':
                                case 'tomorrow':
                                case 'nextweek': {
                                    acc = setTaskPeriod(acc, task.period, task)
                                    break
                                }
                                default: {
                                    acc = setTaskPeriod(acc, moment(task.endAt).month(), task)
                                }
                            }
                        } else {
                            acc = setTaskPeriod(acc, 'completed', task)
                        }
                    } else {
                        acc = setTaskPeriod(acc, 'today', task)
                    }

                    return acc
                }, [])
            )

            res.status(200).json({
                tasks: groupedTasks
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

function setTaskPeriod(data: any[], period: string | number, task: any) {
    const index = data.findIndex((obj: any) => obj.period === period)

    if (index !== -1) {
        data[index].tasks.push(task)
    } else {
        data.push({
            period: period,
            tasks: [task]
        })
    }

    return data
}

function sortGroupedTasks(data: any[]) {
    const periodWeight: any = {
        today: 4,
        tomorrow: 3,
        nextweek: 2,
        completed: -9999
    }

    return data.sort((a: any, b: any) => {
        const periodWeightA = periodWeight[a.period] ?? 1
        const periodWeightB = periodWeight[b.period] ?? 1

        if (periodWeightA > periodWeightB) return -1
        if (periodWeightA < periodWeightB) return 1
        return 0
    })
}

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const { title, startAt, endAt, responsibles, period, connections } = req.body
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
                period,
                createdBy: req.user.userId,
                companyRef: req.user.companyId,
                workspaceName: req.user.workspaceName
            }

            const task = await taskService.create(data)
            res.status(200).json({ message: 'Success', task: task })
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
            const {
                _id,
                title,
                description,
                startAt,
                endAt,
                stage,
                responsibles,
                connections,
                executors,
                checklists,
                files
            } = req.body
            const taskService = new DBService({
                connection: req.user,
                schemaName: 'Task'
            })

            const data = {
                title,
                description,
                startAt,
                endAt,
                responsibles,
                connections,
                stage,
                executors,
                files,
                checklists
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
