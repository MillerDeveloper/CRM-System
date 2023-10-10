import { isJson } from '@globalShared/utils/system.utils'
import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { Types } from 'mongoose'
import axios from 'axios'
import { FileService } from '@services/global/file.service'

const router = Router()

router.get(
    '/call',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/:generalCallID/hangUp',
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

            const { key, secret } = company.integrations.binotel

            await axios('https://api.binotel.com/api/4.0/calls/hangup-call.json', {
                data: JSON.stringify({
                    generalCallID: req.params.generalCallID,
                    key,
                    secret
                })
            })

            res.status(200).json({ message: 'Success' })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/:generalCallID/callDetails',
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

            const { key, secret } = company.integrations.binotel

            const response = await axios(
                'https://api.binotel.com/api/4.0/stats/call-details.json',
                {
                    data: JSON.stringify({
                        generalCallID: req.params.generalCallID,
                        key,
                        secret
                    })
                }
            )

            res.status(200).json({
                response: response.data.callDetails[req.params.generalCallID]
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    '/:generalCallID/callRecord',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const companyService = new DBService({
                connection: req.user,
                schemaName: 'Company'
            })

            const callService = new DBService({
                connection: req.user,
                schemaName: 'Call'
            })

            const collectionElementService = new DBService({
                connection: req.user,
                schemaName: 'CollectionElement'
            })

            const fileService = new FileService({ connection: req.user })
            const company = await companyService.findOne({
                _id: new Types.ObjectId(req.user.companyId)
            })

            const { duration, callType, responseTime, status, connection } = req.body
            const { key, secret } = company.integrations.binotel

            const response = await axios('https://api.binotel.com/api/4.0/stats/call-record.json', {
                method: 'POST',
                data: JSON.stringify({
                    generalCallID: req.params.generalCallID,
                    key,
                    secret
                })
            })

            if (response.data?.url) {
                const recordFileUrl = response.data.url

                const fileResponse = await axios.get(recordFileUrl, {
                    responseType: 'arraybuffer'
                })

                const filename = 'voise-' + Date.now() + '.mp3'

                const file: any = await fileService.upload(
                    { name: filename, data: fileResponse.data },
                    {
                        uploadedBy: req.user.userId,
                        companyRef: req.user.companyId,
                        workspaceName: req.user.workspaceName,
                        connection: {
                            to: connection.to,
                            model: connection.model,
                            collectionRef: connection.collectionRef
                        },
                        path: '',
                        fileType: 'callRecord'
                    }
                )

                const call = await callService.create({
                    companyRef: req.user.companyId,
                    workspaceName: req.user.workspaceName,
                    duration: duration,
                    connection: connection,
                    status: status,
                    responseTime: responseTime,
                    callType: callType,
                    calledBy: req.user.userId,
                    recordRef: file._id
                })

                await collectionElementService.updateOne(
                    {
                        _id: new Types.ObjectId(connection.to)
                    },
                    {
                        $push: {
                            calls: {
                                data: call._id,
                                addedBy: req.user.userId
                            }
                        }
                    }
                )

                res.status(200).json({ message: 'Success', call: call })
            } else {
                res.status(400).json({ message: 'Invalid request' })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router
