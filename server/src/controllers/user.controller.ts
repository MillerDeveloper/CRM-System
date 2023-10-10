import { environment } from '@/shared/enviroment'
import { Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { DEFAULT_USER_FIELDS } from '@/shared/constants/db.constants'
import isEmail from 'validator/lib/isEmail'
import MailService from '@services/global/mail.service'
import moment from 'moment'

const router = Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const userService = new DBService({
                connection: req.user,
                schemaName: 'User'
            })

            const currentUser = await userService.findOne(
                { _id: req.user.userId },
                { populate: [], select: DEFAULT_USER_FIELDS }
            )
            const users = await userService.findMany(
                { 'companies.element': req.user.companyId },
                { populate: [], query: req.query, select: DEFAULT_USER_FIELDS }
            )
            res.status(200).json({
                users: users,
                currentUser: currentUser
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    '/invite',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const userService = new DBService({
                connection: req.user,
                schemaName: 'User'
            })

            const companyService = new DBService({
                connection: req.user,
                schemaName: 'Company'
            })

            const { emails, rights } = req.body

            for (const email of emails) {
                if (isEmail(email)) {
                    const candidate = await userService.findOne({ email })

                    if (candidate) {
                        return res
                            .status(400)
                            .json({ message: 'User with this email is already exist' })
                    }

                    const newUserId = new Types.ObjectId()
                    await userService.create({
                        email,
                        rights,
                        _id: newUserId,
                        name: {
                            first: '',
                            last: '',
                            full: ''
                        },
                        workspaceName: req.user.workspaceName,
                        companies: [
                            {
                                _id: false,
                                element: req.user.companyId,
                                addedAt: moment().toDate()
                            }
                        ],
                        info: {
                            register: {
                                method: 'invitation',
                                invitation: {
                                    invitedBy: req.user.userId
                                }
                            }
                        },
                        settings: {
                            notifications: {}
                        }
                    })

                    await companyService.updateOne(
                        {
                            _id: new Types.ObjectId(req.user.companyId)
                        },
                        {
                            $push: {
                                users: {
                                    element: newUserId
                                }
                            }
                        }
                    )

                    const emailLink = `${environment.clientUrl}/register?isInvite=true&companyId=${req.user.companyId}&workspaceName=${req.user.workspaceName}&userId=${newUserId}&email=${email}`
                    await MailService.sendMail({
                        to: email,
                        from: environment.mainEmail,
                        subject: 'Invite to CRM',
                        html: `
                            <h1>Invitation</h1>
                            <h2>Hello</h2>
                            <p>For registration. please confirm your email by click this <a href="${emailLink}">link<a></p>
                        `
                    })
                } else {
                    return res.status(400).json({ message: 'Invalid email' })
                }
            }

            res.status(200).json({ message: 'Success' })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.patch(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const userService = new DBService({
                connection: req.user,
                schemaName: 'User'
            })

            const { avatar, name, rights, departments, settings, info, integrations } = req.body
            const { language, theme } = info

            const data = {
                avatar,
                name,
                rights,
                departments,
                settings,
                integrations,
                ['info.language']: language,
                ['info.theme']: theme
            }

            const user = await userService
                .updateOne({ _id: new Types.ObjectId(req.params.userId) }, { $set: data })
                .select(DEFAULT_USER_FIELDS)

            res.status(200).json({
                user: user
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router
