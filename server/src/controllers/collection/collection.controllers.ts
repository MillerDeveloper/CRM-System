import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { Types } from 'mongoose'
import { checkUserRights } from '@/middleware/user-rights.middleware'
import moment from 'moment'

const router = Router()
const populate: any[] = [
    {
        path: 'viewOptions.fields.collectionRef.data',
        select: {
            _id: true,
            label: true,
            classification: true,
            viewOptions: true
        }
    }
]

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkUserRights('system', {
        mustNotEqualTo: 'forbidden',
        rightPath: 'modules.collections.view'
    }),
    async (req: Request, res: Response) => {
        try {
            const collectionService = new DBService({
                connection: req.user,
                schemaName: 'Collection'
            })

            const userService = new DBService({
                connection: req.user,
                schemaName: 'User'
            })

            const filter = collectionService.getFilters(
                { companyRef: req.user.companyId },
                req.query
            )

            const currentUser = await userService.findOne({
                _id: new Types.ObjectId(req.user.userId)
            })

            let collections = await collectionService.findMany(filter)
            collections = collections.filter((collection: any) => {
                const index = currentUser.rights.collections.findIndex((right: any) =>
                    new Types.ObjectId(right.collectionRef).equals(collection._id)
                )
                return index !== -1
            })

            res.status(200).json({
                collections: collections,
                totalCount: await collectionService.countDocuments(filter)
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    checkUserRights('collections', {
        right: 'view',
        mustNotEqualTo: 'forbidden'
    }),
    async (req: Request, res: Response) => {
        try {
            const collectionService = new DBService({
                connection: req.user,
                schemaName: 'Collection'
            })

            const filter = collectionService.getFilters(
                { _id: new Types.ObjectId(req.params.id) },
                req.query
            )

            const collection = await collectionService.findOne(filter, {
                populate: populate
            })
            res.status(200).json({
                collection: collection
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkUserRights('system', {
        rightPath: 'modules.collections.create'
    }),
    async (req: Request, res: Response) => {
        try {
            const {
                label,
                description,
                classification,
                collectionType,
                viewOptions,
                elementsType,
                settings
            } = req.body
            const collectionService = new DBService({
                connection: req.user,
                schemaName: 'Collection'
            })

            const userService = new DBService({
                connection: req.user,
                schemaName: 'User'
            })

            const data = {
                label,
                description,
                viewOptions,
                settings,
                workspaceName: req.user.workspaceName,
                createdBy: req.user.userId,
                companyRef: req.user.companyId,
                classification: classification || {
                    elementsType: elementsType,
                    collectionType: collectionType
                },
                users: [
                    {
                        element: req.user.userId,
                        addedAt: moment().toDate()
                    }
                ]
            }

            const collection = await collectionService.create(data)
            await userService.updateOne(
                {
                    _id: new Types.ObjectId(req.user.userId)
                },
                {
                    $push: {
                        ['rights.collections']: {
                            collectionRef: collection._id,
                            rights: {
                                create: true,
                                view: 'allowed',
                                edit: 'allowed',
                                delete: 'allowed',
                                import: true,
                                export: true
                            }
                        }
                    }
                }
            )

            res.status(200).json({ message: 'Success', collection: collection })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.patch(
    '/',
    passport.authenticate('jwt', { session: false }),
    checkUserRights('system', {
        mustNotEqualTo: 'forbidden',
        rightPath: 'modules.collections.edit'
    }),
    async (req: Request, res: Response) => {
        try {
            const collectionService = new DBService({
                connection: req.user,
                schemaName: 'Collection'
            })

            const { _id, label, description, viewOptions, settings, users, classification } =
                req.body

            const data = {
                label,
                description,
                viewOptions,
                settings,
                users,
                classification
            }
            const filter = {
                _id: new Types.ObjectId(_id)
            }

            await collectionService.updateOne(filter, { $set: data })

            const collection = await collectionService.findOne(filter)
            res.status(200).json({ message: 'Success', collection: collection })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.delete(
    '/:ids',
    passport.authenticate('jwt', { session: false }),
    checkUserRights('system', {
        mustNotEqualTo: 'forbidden',
        rightPath: 'modules.collections.delete'
    }),
    async (req: Request, res: Response) => {
        try {
            const collectionService = new DBService({
                connection: req.user,
                schemaName: 'Collection'
            })

            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement'
            })

            const ids = req.params.ids?.split('|')

            if (ids?.length > 0) {
                await collectionService.deleteMany({
                    workspaceName: req.user.workspaceName,
                    companyRef: new Types.ObjectId(req.user.companyId),
                    _id: {
                        $in: ids
                    }
                })

                await collectionElementService.deleteMany({
                    workspaceName: req.user.workspaceName,
                    companyRef: new Types.ObjectId(req.user.companyId),
                    collectionRef: {
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
