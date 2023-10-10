import { resolve } from 'path'
import { version } from '../../package.json'

export const environment = {
    mongoURI:
        process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI
            : 'mongodb://127.0.0.1:27017',
    // mongodb+srv://Kirill:132244@cluster0.0ifgbzj.mongodb.net/?retryWrites=true&w=majority
    jwt: 'BCS',
    serverApiUrl:
        process.env.server || process.env.NODE_ENV === 'production'
            ? process.env.SERVER_URL
            : 'http://localhost:80/api',
    tokenExpiresIn: 864000000,
    isProd: process.env.NODE_ENV === 'production',
    isDev: process.env.NODE_ENV === 'development',
    pathToUploads: resolve(__dirname, '../', '../', 'uploads'),
    mainEmail: process, env.PRIMARY_EMAIL,
    version: version,
    clientUrl:
        process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : 'http://localhost:4200'
}
