import {isJson} from '@globalShared/utils/system.utils'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { BINOTEL_EVENTS, CHAT_EVENTS } from '@globalShared/constants/socket.constants'
import WebSocket from 'ws'

export default function (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    io: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) {
    const ws = new WebSocket('wss://ws.binotel.com:9002')

    ws.on('open', function open() {
        console.log('Binotel Socket Status: ', ws.readyState, ' (open)')
    })

    ws.onmessage = function (msg: any) {
        const data = isJson(msg.data) ? JSON.parse(msg.data) : msg.data
        socket.emit(BINOTEL_EVENTS[data.eventName], data)

        // 0577440169

        if (msg.data.indexOf('Connected to Binotel WebSocket. Please, authorise!') !== -1) {
            ws.send(
                JSON.stringify({
                    task: 'authLikeService',
                    key: '5506dc-1c86688',
                    secret: 'ecec7e-348e9c-c0340c-58d6af-d81a237b'
                })
            )
        }
    }

    // socket.on(BINOTEL_EVENTS.callStart, async (response: { data: any; info: any }) => {

    // })
}

// Websocket Key: 5506dc-1c86688
// Websocket Secret: ecec7e-348e9c-c0340c-58d6af-d81a237b
