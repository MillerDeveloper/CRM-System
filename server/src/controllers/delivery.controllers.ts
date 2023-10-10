import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'

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
            const deliveryService = new DBService({
                connection: req.user,
                schemaName: 'Delivery',
                registerSchemas: ['Collection', 'CollectionElement']
            })

            const filter = deliveryService.getFilters({ companyRef: req.user.companyId }, req.query)
            const deliveries = await deliveryService.findMany(filter, {
                query: req.query,
                populate: populate
            })

            res.status(200).json({
                deliveries: deliveries,
                totalCount: await deliveryService.countDocuments(filter)
            })
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
            const deliveryService = new DBService({
                connection: req.user,
                schemaName: 'Delivery'
            })

            const { connection, cost, deliveryAt, waybill } = req.body
            const delivery = await deliveryService.create({
                connection,
                cost,
                deliveryAt,
                waybill,
                createdBy: req.user.userId,
                companyRef: req.user.companyId,
                workspaceName: req.user.workspaceName
            })

            res.status(200).json({
                delivery: delivery
            })
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
            const deliveryService = new DBService({
                connection: req.user,
                schemaName: 'Delivery'
            })

            const ids = req.params.ids?.split('|')

            if (ids?.length > 0) {
                await deliveryService.deleteMany({
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
