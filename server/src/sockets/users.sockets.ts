import { USERS_EVENTS } from '@globalShared/constants/socket.constants'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

const ACTIVE_USERS: any[] = []

export default function (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    socket.on(
        USERS_EVENTS.wentPage,
        (response: {
            data: { url: string }
            info: { userId: string; workspaceName: string; companyId: string }
        }) => {
            const { companyId, userId, workspaceName } = response.info
            socket.join(companyId)
            removeActiveUser(socket.id)

            ACTIVE_USERS.push({
                url: response.data.url,
                userId: userId,
                workspaceName: workspaceName,
                companyId: companyId,
                socketId: socket.id
            })

            io.to(companyId).emit(USERS_EVENTS.usersUpdated, {
                activeUsers: getActiveUsers(companyId)
            })
        }
    )

    socket.on('disconnect', () => {
        const index = ACTIVE_USERS.findIndex((data: any) => data.socketId === socket.id)

        if (index !== -1) {
            const user = ACTIVE_USERS[index]
            socket.join(user.companyId)

            removeActiveUser(socket.id)
            io.to(user.userId).emit(USERS_EVENTS.usersUpdated, {
                activeUsers: getActiveUsers(user.companyId)
            })
        }
    })
}

function removeActiveUser(socketId: string) {
    const index = ACTIVE_USERS.findIndex((data: any) => data.socketId === socketId)

    if (index !== -1) {
        ACTIVE_USERS.splice(index, 1)
    }
}

function getActiveUsers(companyId: string) {
    return ACTIVE_USERS.filter((data: any) => data.companyId === companyId)
}
