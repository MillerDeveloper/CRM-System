import { serverError } from '@/utils/error-handler.util'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { GmailService } from '@services/integrations/gmail.service'
import { google } from 'googleapis'
import { getGoogleAuthClient } from '@/utils/system.utils'
import { createTransport } from 'nodemailer'
const router = Router()
const GMAIL_SCOPES = [
    'https://mail.google.com',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]

router.get(
    '/:email',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const gmailService = await new GmailService(req.user, {
                service: 'gmail',
                email: req.params.email
            }).init()

            const userId = 'me'
            const { search, nextPageToken, limit, labelIds } = req.query as any
            console.log('query', req.query)

            const result = await gmailService.getMessagesList({
                userId: userId,
                labelIds: labelIds,
                limit: limit,
                search: search,
                nextPageToken: nextPageToken
            })

            const labelsResponse = await gmailService.getLabels(userId)

            res.header('Access-Control-Allow-Origin', '*')
            res.status(200).json({
                messages: result.messages,
                labels: labelsResponse.data.labels,
                data: { nextPageToken: result.nextPageToken }
            })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/auth/url',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const oAuth2Client = getGoogleAuthClient()
            const url = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: GMAIL_SCOPES
            })

            res.status(200).json({ url })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/auth/setCredentials',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const { code } = req.query as any
            const oAuth2Client = getGoogleAuthClient()
            const result = await oAuth2Client.getToken(code)

            if (result.res?.status === 200) {
                oAuth2Client.setCredentials(result.tokens)
                const oAuth2 = google.oauth2({
                    auth: oAuth2Client,
                    version: 'v2'
                })

                const { data } = await oAuth2.userinfo.get()
                res.status(200).json({ tokens: result.tokens, profile: data })
            } else {
                res.status(400).json({ message: 'Invalid data' })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    '/sendEmail',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const gmailService = await new GmailService(req.user, {
                service: 'gmail',
                email: req.body.from
            }).init()

            await gmailService.sendEmail(req.body)
            res.status(200).json({ message: 'Success' })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.patch(
    '/:email/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            if (req.params.id) {
                const gmailService = await new GmailService(req.user, {
                    service: 'gmail',
                    email: req.params.email
                }).init()

                const mail = await gmailService.updateOne(req.params.id, {
                    addLabelIds: req.body.addLabelIds,
                    removeLabelIds: req.body.removeLabelIds
                })

                res.status(200).json(mail)
            } else {
                res.status(400).json({ messages: 'Invalid ID' })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router
