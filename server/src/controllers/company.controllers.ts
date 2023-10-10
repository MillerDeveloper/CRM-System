import { Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { DEFAULT_COMPANIES_FIELDS, DEFAULT_USER_FIELDS } from '@/shared/constants/db.constants'

const router = Router()
const populate: any = [
    {
        path: 'sites.distribution.users.data',
        select: DEFAULT_USER_FIELDS
    }
]

router.get(
    '/currentCompany',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const companyService = new DBService({
                connection: req.user,
                schemaName: 'Company',
                registerSchemas: ['User']
            })

            const currentCompany = await companyService.findOne(
                { _id: new Types.ObjectId(req.user.companyId) },
                { populate: populate, select: DEFAULT_COMPANIES_FIELDS }
            )

            res.status(200).json({
                currentCompany: currentCompany
            })
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
            const companyService = new DBService({
                connection: req.user,
                schemaName: 'Company'
            })

            const { name, users, settings, integrations, sites } = req.body
            const currentCompany = await companyService
                .updateOne(
                    { _id: new Types.ObjectId(req.user.companyId) },
                    {
                        $set: {
                            name,
                            users,
                            sites,
                            settings,
                            integrations
                        }
                    }
                )
                .select(DEFAULT_COMPANIES_FIELDS)

            res.status(200).json({
                currentCompany: currentCompany
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router


// 1. Всё ли работает всё ли есть ли дефекты
// 2. Сколько лет ей, сколько была в использовании
// 2. Можно ли завтра встретится в Ха и где