import { Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { getModelFilter } from '@globalShared/utils/system.utils'

const router = Router()

const populate: any[] = [
    {
        path: 'connection',
        populate: [
            {
                path: 'to'
            },
            {
                path: 'collectionRef'
            }
        ]
    }
]

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const callService = new DBService({
                connection: req.user,
                schemaName: 'Call',
                registerSchemas: ['Collection', 'CollectionElement']
            })
            const filter = callService.getFilters(
                {
                    companyRef: new Types.ObjectId(req.user.companyId)
                },
                req.query
            )

            const calls = await callService.findMany(filter, {
                populate: populate,
                query: req.query
            })

            res.status(200).json({
                calls: calls
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router
