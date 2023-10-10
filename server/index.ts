import { IRequestData } from '@globalInterfaces/system.interface'
import express, { Express } from 'express'
import dotenv from 'dotenv'
import routes from '@/controllers/routes'
import morgan from 'morgan'
import cors from 'cors'
import { connect, set } from 'mongoose'
import { environment } from '@/shared/enviroment'
import cookieParser from 'cookie-parser'
import { initPassport } from '@/middleware/passport.middleware'
import compression from 'compression'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import passport from 'passport'
import { resolve } from 'path'
import { MAX_FILE_SIZE } from '@globalShared/constants/system.constants'
import rateLimit from 'express-rate-limit'
import { Server as SocketServer } from 'socket.io'
import { createServer } from 'http'
import { initSockets } from '@/sockets/sockets'

dotenv.config()

const app: Express = express()
const port = process.env.PORT ?? 80
const origins = [
    'http://localhost:4200',
    'http://127.0.0.1',
    'http://localhost',
]

declare module 'express-serve-static-core' {
    export interface Request {
        user: IRequestData
    }
}

;(async function () {
    try {
        set('strictQuery', false)
        await connect(environment.mongoURI, {
            autoIndex: environment.isDev,
            maxPoolSize: 1000,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000
        }).then(() => {
            console.info('MongoDB has been successfully connected')
        })
    } catch (error) {
        console.error(error)
    }
})()

app.set('trust proxy', true)
express.static(resolve(__dirname, 'uploads'))
app.use(
    cors({
        origin: origins,
        preflightContinue: true,
    })
)
app.use(
    fileUpload({
        limits: { fileSize: MAX_FILE_SIZE },
        preserveExtension: 6,
        abortOnLimit: true,
        uriDecodeFileNames: true,
        safeFileNames: true,
        parseNested: true
    })
)
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 2000,
        standardHeaders: true,
        legacyHeaders: false
    })
)
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: false
    })
)
app.use(cookieParser())
app.use(compression())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))
initPassport(passport)

app.use('/api', routes)
const server = createServer(app)
const io = new SocketServer(server, {
    transports: ['websocket', 'polling'],
    cors: {
        origin: origins
    }
})

io.on('connection', (socket: any) => {
    initSockets(socket, io)
})

if (environment.isProd) {
    app.use(express.static(resolve(__dirname, '../', 'client')))
    app.get('*', (_: any, res: any) => {
        res.sendFile(resolve(__dirname, '../', 'client', 'index.html'))
    })
} else {
    app.use(morgan('dev'))
}

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
