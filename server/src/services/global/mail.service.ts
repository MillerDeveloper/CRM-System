import {environment} from '@/shared/enviroment'
import { createTransport } from 'nodemailer'

class MailService {
    async sendMail(body: any) {
        const transport = createTransport({
            service: 'gmail',
            secure: false,
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.GOOGLE_USER_EMAIL ?? environment.mainEmail,
                pass: 'tdtqeobfztqsyblf'
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        if (!body.from) {
            body.from = process.env.GOOGLE_USER_EMAIL
        }

        return await transport.sendMail(body)
    }
}

export default new MailService()
