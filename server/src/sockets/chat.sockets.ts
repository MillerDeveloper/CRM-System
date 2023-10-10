import { Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { CHAT_EVENTS } from '@globalShared/constants/socket.constants'
import { TelegramService } from '@services/integrations/telegram.service'

export default function (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    new TelegramService().init(socket, io)
    socket.on(CHAT_EVENTS.sendMessage, async (response: { data: any; info: any }) => {
        const { messageType, text, fileType, answerTo, chatRef } = response.data
        const { userId, companyId, workspaceName } = response.info

        const messageService = new DBService({ connection: response.info, schemaName: 'Message' })
        const chatService = new DBService({ connection: response.info, schemaName: 'Chat' })
        const chat = await chatService.findOne({ _id: new Types.ObjectId(chatRef) })

        if (chat.externalConfig?.service) {
            const companyService = new DBService({
                connection: response.info,
                schemaName: 'Company'
            })
            const company = await companyService.findOne({
                _id: new Types.ObjectId(response.info.companyId)
            })

            switch (chat.externalConfig.service) {
                case 'telegram': {
                    const telegramService = new TelegramService(company.integrations.telegram.key)
                    telegramService.sendMessage(chat.externalConfig.identifier, text)
                }
            }
        }

        const message = await messageService.create({
            text,
            messageType,
            fileType,
            answerTo,
            chatRef,
            createdBy: userId,
            companyRef: companyId,
            workspaceName
        })

        io.emit(CHAT_EVENTS.newMessage, { message })
    })
}
