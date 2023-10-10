import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { Types } from 'mongoose'
import axios from 'axios'

const router = Router()
const novaposhtaApi = 'https://api.novaposhta.ua/v2.0/json'

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const companyService = new DBService({
                connection: req.user,
                schemaName: 'Company'
            })

            const company = await companyService.findOne({
                _id: new Types.ObjectId(req.user.companyId)
            })

            const apiKey = company.integrations.novaposhta?.key

            if (apiKey) {
                const response = await axios(novaposhtaApi, {
                    data: JSON.stringify({
                        ...req.body,
                        apiKey: apiKey
                    })
                })

                if (response.data.success) {
                    res.status(200).json({
                        response: response.data.data
                    })
                } else {
                    res.status(400).json({
                        message: 'Invalid data'
                    })
                }
            } else {
                res.status(400).json({
                    message: 'Invalid api key'
                })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router
