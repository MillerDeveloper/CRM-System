import { DEFAULT_USER_FIELDS } from '@/shared/constants/db.constants'
import { IRequestData } from '@globalShared/interfaces/system.interface'
import { DBService } from '@services/global/db.service'
import { Types } from 'mongoose'
import { gmail_v1, google } from 'googleapis'
import { getGoogleAuthClient } from '@/utils/system.utils'
import { createTransport } from 'nodemailer'

const oAuth2Client = getGoogleAuthClient()

export class GmailService {
    gmailService!: gmail_v1.Gmail
    connection!: IRequestData
    config!: any

    constructor(connection: IRequestData, config: { service: string; email: string }) {
        this.connection = connection
        this.config = config
    }

    async init() {
        const gmailService = new GmailService(this.connection, this.config)
        await gmailService.auth()
        return gmailService
    }

    async auth() {
        const user: any = await new DBService({
            connection: this.connection,
            schemaName: 'User'
        })
            .findOne({
                _id: new Types.ObjectId(this.connection.userId)
            })
            .select(DEFAULT_USER_FIELDS)

        const index = user.integrations.mail.findIndex(
            (mail: any) => mail.email === this.config.email
        )

        if (index !== -1) {
            oAuth2Client.setCredentials({
                access_token: user.integrations.mail[index].token.access,
                refresh_token: user.integrations.mail[index].token.refresh,
                token_type: 'Bearer'
            })
            
            await oAuth2Client.refreshAccessToken()

            this.gmailService = google.gmail({
                version: 'v1',
                auth: oAuth2Client
            })
        }
    }

    getProfile(userId: string = 'me') {
        return this.gmailService.users.getProfile({
            userId: userId
        })
    }

    async getMessagesList(fetchConfig: {
        userId: string
        labelIds: string[]
        search: string
        limit: number
        nextPageToken: string
    }) {
        const messagesResponse: any = await this.gmailService.users.messages.list({
            userId: fetchConfig.userId,
            labelIds: fetchConfig.labelIds,
            q: fetchConfig.search,
            maxResults: fetchConfig.limit,
            pageToken: fetchConfig.nextPageToken
        })

        const messagesList = messagesResponse.data.messages
        const messages: any[] = []

        if (messagesList) {
            for (let message of messagesList) {
                message = await this.getMessage(message.id, fetchConfig.userId)
                const mailData = message.data
                const mailHeaders = mailData.payload.headers

                messages.push({
                    ...message,
                    id: mailData.id,
                    snippet: mailData.snippet,
                    labelIds: mailData.labelIds,
                    subject: this.findInHeaders(mailHeaders, 'Subject'),
                    from: this.findInHeaders(mailHeaders, 'From'),
                    createdAt: this.findInHeaders(mailHeaders, 'Date'),
                    textHtml: this.getMessageBody(mailData.payload, 'text/html'),
                    textPlain: this.getMessageBody(mailData.payload, 'text/plain')
                })
            }
        }

        return { messages, nextPageToken: messagesResponse.data.nextPageToken }
    }

    findInHeaders(headers: any[], searchKey: string) {
        return headers.find((header: any) => header.name === searchKey)?.value || ''
    }

    getMessageBody(payload: any | any[], mimeType: string) {
        if (Array.isArray(payload.parts)) {
            const data = payload.parts
                ?.map((part: any) => {
                    if (part.mimeType === mimeType) {
                        return part.body.data?.replace(/-/g, '+').replace(/_/g, '/')
                    }
                })
                .join('')

            if (data) {
                return Buffer.from(data, 'base64').toString('utf8')
            } else {
                return ''
            }
        } else {
            return Buffer.from(payload.body.data, 'base64').toString('utf8')
        }
    }

    async getMessage(messageId: any, userId: string) {
        return this.gmailService.users.messages.get({
            id: messageId,
            format: 'full',
            userId: userId
        })
    }

    async sendEmail(config: { sendTo: any[]; from: string; subject: string; text: string }) {
        const response: any = await oAuth2Client.refreshAccessToken()
        const transport = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                type: 'OAuth2',
                user: config.from,
                accessToken: response.credentials.access_token
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        await transport.sendMail({
            to: config.sendTo,
            from: config.from,
            subject: config.subject,
            text: config.text
        })
    }

    updateOne(id: string, data: { addLabelIds: any[]; removeLabelIds: any[] }) {
        return this.gmailService.users.messages.modify({
            userId: 'me',
            id: id,
            requestBody: {
                addLabelIds: data.addLabelIds || [],
                removeLabelIds: data.removeLabelIds || []
            }
        })
    }

    getLabels(userId: string) {
        return this.gmailService.users.labels.list({ userId })
    }
}
