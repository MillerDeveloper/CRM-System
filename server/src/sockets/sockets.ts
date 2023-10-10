import chatSockets from  './chat.sockets'
import binotelSockets from  './binotel.sockets'
import usersSockets from  './users.sockets'

export function initSockets(socket: any, io: any) {
    chatSockets(socket, io)
    binotelSockets(socket, io)
    usersSockets(socket, io)
}