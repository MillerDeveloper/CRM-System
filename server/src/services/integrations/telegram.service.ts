import {
    DEFAULT_COMPANIES_FIELDS,
    DEFAULT_USER_FIELDS
} from './../../shared/constants/db.constants'
import { DBService } from './../global/db.service'
import { getListDatabases } from '@/utils/db.utils'
import { connection, Types } from 'mongoose'
import TelegramBot from 'node-telegram-bot-api'
import { CHAT_EVENTS } from '@globalShared/constants/socket.constants'
import { getUserFromDistribution } from '@/utils/user.utils'

let bots: any = {}

export class TelegramService {
    private token!: string
    constructor(token?: string) {
        if (token) {
            this.token = token
        }
    }

    async init(socket: any, io: any) {
        if (connection.db) {
            const result = await getListDatabases()
            if (result.ok) {
                for (const database of result.databases) {
                    const db = connection.useDb(database.name)
                    const companyService = new DBService({
                        connection: db,
                        schemaName: 'Company'
                    })

                    const companies = await companyService
                        .findMany({
                            ['integrations.telegram.key']: {
                                $exists: true
                            }
                        })
                        .select(DEFAULT_COMPANIES_FIELDS)

                    for (const company of companies) {
                        const token = company.integrations.telegram.key

                        if (token && !bots[token]) {
                            bots[token] = new TelegramBot(token, { polling: true })
                            bots[token].on('message', (message: any) =>
                                this.onMessage(message, {
                                    token: token,
                                    company: company,
                                    connection: db,
                                    socket: socket,
                                    io: io
                                })
                            )
                        }
                    }
                }
            }
        }
    }

    sendMessage(chatId: string, data: any) {
        return bots[this.token].sendMessage(chatId, data)
    }

    async onMessage(
        tgMessage: any,
        config: {
            token: string
            company: any
            connection: any
            socket: any
            io: any
        }
    ) {
        const chatService = new DBService({
            connection: config.connection,
            schemaName: 'Chat'
        })
        const messageService = new DBService({
            connection: config.connection,
            schemaName: 'Message'
        })

        let chat: any = await chatService.findOne({
            ['externalConfig.identifier']: tgMessage.chat.id
        })

        if (tgMessage.text === '/start') {
            if (!chat) {
                const user = await getUserFromDistribution({
                    distribution: config.company.integrations.telegram.distribution,
                    requestData: config.connection
                })

                const data = {
                    chatType: 'single',
                    mode: 'external',
                    externalConfig: {
                        service: 'telegram',
                        identifier: tgMessage.chat.id
                    },
                    companyRef: config.company._id,
                    chatWith: [
                        {
                            data: user.data
                        }
                    ],
                    createdBy: {
                        name: {
                            first: tgMessage.chat.first_name,
                            username: tgMessage.chat.username
                        }
                    },
                    workspaceName: config.company.workspaceName
                }

                chat = await chatService.create(data)
            }

            bots[config.token].sendMessage(
                tgMessage.chat.id,
                config.company.integrations.telegram.welcomeMessage
            )
        }

        if (chat) {
            const message = await messageService.create({
                text: tgMessage.text,
                mode: 'external',
                chatRef: chat._id,
                companyRef: config.company._id,
                workspaceName: config.company.workspaceName
            })

            await chatService.updateOne(
                { _id: new Types.ObjectId(chat._id) },
                {
                    $push: {
                        messages: {
                            data: message._id
                        }
                    }
                }
            )

            config.io.emit(CHAT_EVENTS.newMessage, { message })
        }
    }
}
