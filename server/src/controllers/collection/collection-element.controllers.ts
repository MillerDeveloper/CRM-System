import { getUserFromDistribution } from '@/utils/user.utils'
import { getOnlyNumbers, hasCollectionRight } from '@globalShared/utils/system.utils'
import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { Types } from 'mongoose'
import toBoolean from 'validator/lib/toBoolean'
import {
    CONNECTION_POPULATE_WITH_COMMENTS,
    DEFAULT_USER_FIELDS,
    RESPONSIBLES_POPULATE
} from '@/shared/constants/db.constants'
import cors from 'cors'
import moment from 'moment'
import { getUtmParams } from '@/utils/system.utils'

const router = Router()
const populate = [CONNECTION_POPULATE_WITH_COMMENTS, RESPONSIBLES_POPULATE]
const corsAllowOptions = {
    origin: '*',
    credentials: true
}

router.get(
    '/findInAllCollections',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const collectionService = new DBService({
                connection: req.user,
                schemaName: 'Collection'
            })

            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement',
                registerSchemas: ['User', 'Collection']
            })

            const userService = new DBService({
                connection: req.user,
                schemaName: 'User'
            })

            const collections = await collectionService.findMany({
                companyRef: new Types.ObjectId(req.user.companyId)
            })

            const user = await userService.findOne({ _id: new Types.ObjectId(req.user.userId) })

            for (const collection of collections) {
                const hasRight = hasCollectionRight({
                    collectionId: new Types.ObjectId(collection._id),
                    rights: user.rights.collections,
                    right: 'view',
                    mustNotEqualTo: 'forbidden'
                })

                if (hasRight) {
                    const filter = collectionService.getFilters(
                        { collectionRef: new Types.ObjectId(collection._id) },
                        req.query
                    )

                    const method = req.query.method === 'findOne' ? 'findOne' : 'findMany'
                    const elements = await collectionElementService[method](filter, {
                        populate: populate,
                        query: req.query
                    })

                    if (
                        (Array.isArray(elements) && elements.length > 0) ||
                        (!Array.isArray(elements) && !!elements)
                    ) {
                        if (method === 'findOne') {
                            return res.status(200).json({
                                element: elements,
                                collection
                            })
                        } else {
                            return res.status(200).json({
                                elements: elements,
                                collection
                            })
                        }
                    }
                }
            }

            res.status(404).json({
                message: 'Not found'
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/:collectionId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement',
                registerSchemas: ['Collection', 'User']
            })

            const userService = new DBService({
                connection: req.user,
                schemaName: 'User'
            })

            const user = await userService.findOne({ _id: new Types.ObjectId(req.user.userId) })
            const filter = collectionElementService.getFilters(
                { collectionRef: new Types.ObjectId(req.params.collectionId) },
                req.query
            )

            if (
                hasCollectionRight({
                    collectionId: req.params.collectionId,
                    rights: user.rights.collections,
                    right: 'view',
                    mustNotEqualTo: 'allowed'
                })
            ) {
                filter['responsibles.data'] = {
                    $in: [new Types.ObjectId(req.user.userId)]
                }
            }

            const noLimit: any = req.query.noLimit || 'false'
            const elements = await collectionElementService.findMany(filter, {
                populate: populate,
                noLimit: toBoolean(noLimit, true),
                query: req.query
            })

            res.status(200).json({
                elements: elements,
                totalCount: await collectionElementService.countDocuments(filter)
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/:collectionId/:elementId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const collectionService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement',
                registerSchemas: ['Collection', 'User']
            })

            const filter = collectionService.getFilters(
                {
                    collectionRef: new Types.ObjectId(req.params.collectionId),
                    _id: new Types.ObjectId(req.params.elementId)
                },
                req.query
            )

            const element = await collectionService.findOne(filter, {
                populate: populate
            })

            res.status(200).json({
                element: element
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
            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement',
                registerSchemas: ['Collection']
            })

            const elementsData = Array.isArray(req.body.data) ? req.body.data : [req.body.data]

            for (const element of elementsData) {
                const data = {
                    ...element,
                    workspaceName: req.user.workspaceName,
                    createdBy: req.user.userId,
                    companyRef: req.user.companyId,
                    responsibles: [
                        {
                            data: req.user.userId
                        }
                    ]
                }

                await collectionElementService.create(data)
            }

            res.status(200).json({ message: 'Success' })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.options('/:collectionId/create', cors(corsAllowOptions) as any)
router.post(
    '/:collectionId/create',
    cors(corsAllowOptions),
    async (req: Request, res: Response) => {
        try {
            const collectionId = req.params.collectionId
            const { workspaceName, companyId } = req.query as any

            if (workspaceName && Types.ObjectId.isValid(companyId as string)) {
                const requestData: any = {
                    workspaceName,
                    companyId
                }
                const collectionElementService = new DBService({
                    connection: requestData,
                    schemaName: 'CollectionElement',
                    registerSchemas: ['Collection']
                })

                const userService = new DBService({
                    connection: requestData,
                    schemaName: 'User'
                })

                const companyService = new DBService({
                    connection: requestData,
                    schemaName: 'Company'
                })

                if (collectionElementService && userService) {
                    const hostname = req.hostname
                    const company = await companyService.findOne({
                        _id: new Types.ObjectId(companyId)
                    })

                    if (company && hostname) {
                        const siteIndex = company.sites.findIndex((site: any) => {
                            return site.url.indexOf(hostname)
                        })

                        if (siteIndex === -1) {
                            return res.status(400).json({ message: 'Invalid data', success: false })
                        }

                        const site = company.sites[siteIndex]
                        let users = site.distribution.users
                        let selectedUser: any

                        switch (site.distribution.method) {
                            case 'queue': {
                                selectedUser = await getUserFromDistribution({
                                    distribution: site.distribution,
                                    requestData
                                })

                                const index = users.findIndex((usr: any) => {
                                    return usr.data.toString() === selectedUser._id.toString()
                                })

                                if (index !== -1) {
                                    users[index].lastRecordAt = moment().toDate()
                                    company.sites[siteIndex].distribution.users = users
                                }

                                await companyService.updateOne(
                                    { _id: new Types.ObjectId(companyId) },
                                    {
                                        $set: {
                                            sites: company.sites
                                        }
                                    }
                                )

                                break
                            }
                            case 'random': {
                                selectedUser = await getUserFromDistribution({
                                    distribution: site.distribution,
                                    requestData
                                })
                                break
                            }
                            case 'workload': {
                                for (const user of users) {
                                    user.documentsCount =
                                        await collectionElementService.countDocuments({
                                            ['responsibles.data']: {
                                                $in: [user._id]
                                            }
                                        })
                                }

                                users = users.sort((a: any, b: any) => {
                                    if (a.documentsCount > b.documentsCount) {
                                        return 1
                                    } else if (a.documentsCount < b.documentsCount) {
                                        return -1
                                    }

                                    return 0
                                })

                                selectedUser = await userService
                                    .findOne({ _id: new Types.ObjectId(users[0].data) })
                                    .select(DEFAULT_USER_FIELDS)

                                break
                            }
                        }

                        let elementData: any = {}
                        console.log(req.body);
                        
                        for (const key of Object.keys(req.body)) {
                            switch (key) {
                                case 'phone': {
                                    if (Array.isArray(req.body[key])) {
                                        elementData[key] = {
                                            label: key,
                                            value: req.body[key].map((phone: string) =>
                                                getOnlyNumbers(phone)
                                            )
                                        }
                                    } else {
                                        elementData[key] = {
                                            label: key,
                                            value: [getOnlyNumbers(req.body[key])]
                                        }
                                    }

                                    break
                                }
                                case 'email': {
                                    elementData[key] = {
                                        label: key,
                                        value: Array.isArray(req.body[key])
                                            ? req.body[key]
                                            : [req.body[key]]
                                    }

                                    break
                                }
                                default: {
                                    elementData[key] = {
                                        label: key,
                                        value: req.body[key]
                                    }
                                }
                            }
                        }

                        const filter: any = {}
                        console.log('Elem data', elementData)

                        for (const field of site.duplicates.fields) {
                            let flags: string = 'i'

                            switch (field.matchMode) {
                                case 'contains': {
                                    flags = 'i'
                                }
                            }

                            if (field._id in elementData) {
                                console.log(field, elementData)

                                if (Array.isArray(req.body[field._id])) {
                                    filter[`${field._id}.value`] = {
                                        $in: req.body[field._id].map(
                                            (val: any) => new RegExp(val, flags)
                                        )
                                    }
                                } else {
                                    filter[`${field._id}.value`] = new RegExp(
                                        req.body[field._id],
                                        flags
                                    )
                                }
                            }
                        }

                        let createNew: boolean = true
                        if (Object.keys(filter).length > 0) {
                            const element = await collectionElementService.findOne(filter).lean()

                            if (element) {
                                switch (site.duplicates.action) {
                                    case 'deleteOld': {
                                        await collectionElementService.deleteOne({
                                            _id: new Types.ObjectId(element._id)
                                        })

                                        break
                                    }
                                    case 'deleteNew': {
                                        await collectionElementService.updateOne(
                                            {
                                                _id: new Types.ObjectId(element._id)
                                            },
                                            {
                                                createdAt: moment().toDate()
                                            }
                                        )

                                        createNew = false
                                        break
                                    }
                                    case 'merge': {
                                        elementData = {
                                            ...element,
                                            ...elementData,
                                            _id: element._id
                                        }

                                        await collectionElementService.deleteOne({
                                            _id: new Types.ObjectId(element._id)
                                        })

                                        if (!Array.isArray(elementData.duplicates)) {
                                            elementData.duplicates = []
                                        }

                                        elementData.duplicates.push({
                                            createdAt: element.createdAt,
                                            responsibles: element.responsibles
                                        })

                                        break
                                    }
                                }
                            }
                        }

                        if (createNew) {
                            const data = {
                                ...elementData,
                                collectionRef: collectionId,
                                workspaceName: workspaceName,
                                companyRef: companyId,
                                createdBy: selectedUser._id,
                                createdAt: moment().toDate(),
                                responsibles: [
                                    {
                                        data: selectedUser._id
                                    }
                                ],
                                info: {
                                    utm: getUtmParams(req.query)
                                }
                            }

                            await collectionElementService.create(data)
                        }

                        return res
                            .status(201)
                            .json({ message: 'Successfully created', success: true })
                    } else {
                        res.status(400).json({ message: 'Invalid data', success: false })
                    }
                } else {
                    res.status(400).json({ message: 'Invalid data', success: false })
                }
            } else {
                res.status(400).json({ message: 'Invalid data', success: false })
            }
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
            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement',
                registerSchemas: ['Collection', 'User']
            })

            const data = {
                ...req.body,
                workspaceName: req.user.workspaceName,
                createdBy: req.user.userId,
                companyRef: req.user.companyId
            }

            const element = await collectionElementService.updateOne(
                { _id: new Types.ObjectId(data._id) },
                { $set: data },
                { populate: populate }
            )
            res.status(200).json({ message: 'Success', element: element })
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
            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement'
            })

            const ids = req.params.ids?.split('|')

            if (ids?.length > 0) {
                await collectionElementService.deleteMany({
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

router.get(
    '/migrate/:ids/:to',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement',
                registerSchemas: ['Collection', 'User']
            })

            const { ids, to } = req.params

            if (ids?.length > 0) {
                await collectionElementService.updateMany(
                    {
                        _id: {
                            $in: ids.split('|')
                        }
                    },
                    {
                        collectionRef: new Types.ObjectId(to),
                        stage: {
                            value: {
                                index: 0
                            }
                        }
                    }
                )

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
