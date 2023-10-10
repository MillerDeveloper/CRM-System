import { Router, Request, Response } from 'express'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import { PASSWORD_VALIDATE } from '@/shared/constants/validate.constants'
import MailService from '@services/global/mail.service'
import { serverError } from '@/utils/error-handler.util'
import { INotVerifiedEmails } from '@/shared/interfaces/auth.interfaces'
import store from 'store'
import { connection, Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { genSaltSync, hash } from 'bcryptjs'
import moment from 'moment'
import { checkExistWorkspace } from '@/utils/db.utils'
import { TOKEN_EXPIRE } from '@globalShared/constants/system.constants'
import { sign } from 'jsonwebtoken'
import { environment } from '@/shared/enviroment'
import { DEFAULT_COMPANIES_FIELDS } from '@/shared/constants/db.constants'
import { TRIAL_USER_RIGHTS } from '@/shared/constants/user.constants'

const router = Router()

const notVerifiedEmailsKey: string = 'notVerifiedEmails'

router.post('/verifyEmail', async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        if (isEmail(email)) {
            if (!store.get(notVerifiedEmailsKey)) {
                store.set(notVerifiedEmailsKey, [])
            }

            const notVerifiedEmails: INotVerifiedEmails[] = store.get(notVerifiedEmailsKey)

            const index = notVerifiedEmails.findIndex((data: any) => data.email === email)
            const verificationCode = getVerificationCode()
            const sessionData: INotVerifiedEmails = {
                email: email,
                verificationCode: verificationCode
            }

            if (index === -1) {
                notVerifiedEmails.push(sessionData)
            } else {
                notVerifiedEmails.splice(index, 1, sessionData)
            }

            store.set(notVerifiedEmailsKey, notVerifiedEmails)
            await MailService.sendMail({
                to: email,
                from: email,
                subject: 'Підтвердіть електронну адресу',
                html: `
                <h1>Шановний клієнте</h1>

                <p>Ми раді вітати Вас в нашій системі управління бізнесом та взаємовідносинами з клієнтами - BCS системі. Наша мета - допомогти Вам в ефективному управлінні Вашим бізнесом та збільшенні продажів.</p>
                
                <p>Ми надаємо Вам зручний і надійний інструмент, що допоможе Вам з легкістю відслідковувати контакти з клієнтами, управляти продажами та відстежувати відвідування веб-сайту, а також управляти всіма організаційно-адміністративними аспектами бізнесу, такими як фінанси, кадри, виробництво, ланцюжок поставок, закупівлі і т.д.. Щоб розпочати використання системи, Вам необхідно зареєструватися в BCS системі.</p>
                
                <p>Ми гарантуємо конфіденційність і захист усіх даних, які Ви вводите в систему. Наша компанія дотримується всіх вимог законодавства щодо захисту персональних даних та зобов'язань зберігати їх в таємниці. Система також забезпечує захист даних за допомогою різноманітних технологій шифрування та інших методів захисту.</p>
                
                <p>
                    Будь ласка, введіть код нижче, щоб зареєструватися в BCS системі:
                    <b>${verificationCode}</b>
                </p>
                
                <p>Якщо виникнуть будь-які запитання або проблеми, будь ласка, зв'яжіться з нашою службою підтримки. Ми завжди готові допомогти Вам використовувати нашу систему і забезпечити Вас необхідною інформацією.</p>
                
                <p>Дякуємо за вибір BCS системи. Ми дуже цінуємо вашу довіру та сподіваємося на довготривалу співпрацю.</p>
                
                <p>
                    З повагою,
                    Команда BCS системи <br>
                </p>
                
                `
            })

            res.status(200).json({ message: 'Email sended' })
        } else {
            return res.status(400).json({ message: 'Email is not a valid' })
        }
    } catch (error) {
        serverError(res, error)
    }
})

router.post('/verifyEmailCode', async (req: Request, res: Response) => {
    try {
        const { email, verificationCode } = req.body

        if (isEmail(email)) {
            const notVerifiedEmails = store.get(notVerifiedEmailsKey) ?? []

            const emailDataIndex = notVerifiedEmails.findIndex(
                (data: INotVerifiedEmails) => data.email === email
            )

            if (
                emailDataIndex !== -1 &&
                notVerifiedEmails[emailDataIndex].verificationCode === verificationCode
            ) {
                notVerifiedEmails.splice(emailDataIndex, 1)
                store.set(notVerifiedEmailsKey, notVerifiedEmails)
                res.status(200).json({ message: 'Success', success: true })
            } else {
                res.status(400).json({ message: 'Not success', success: false })
            }
        } else {
            return res.status(400).json({ message: 'Email is not a valid' })
        }
    } catch (error) {
        serverError(res, error)
    }
})

router.post('/register', async (req: Request, res: Response) => {
    try {
        const {
            email,
            password,
            passwordConfirm,
            firstName,
            lastName,
            companyName,
            companyRef,
            workspaceName,
            isTrial
        } = req.body
        const fullName = `${firstName} ${lastName}`

        if (isEmail(email || '')) {
            if (!workspaceName) {
                return res.status(400).json({ message: 'Workspace name is not valid' })
            }

            if (!firstName || !lastName || !companyName) {
                return res.status(400).json({ message: 'Invalid data' })
            }

            const db = connection.useDb(workspaceName)
            const userService = new DBService({ connection: db, schemaName: 'User' })
            const companyService = new DBService({ connection: db, schemaName: 'Company' })

            if (
                password &&
                password === passwordConfirm &&
                isStrongPassword(password, PASSWORD_VALIDATE)
            ) {
                const isWorkspaceExists = await checkExistWorkspace(workspaceName)

                if (isWorkspaceExists) {
                    const user = await userService.findOne({
                        email: email,
                        ['info.register.method']: 'invitation',
                        ['info.register.invitation.accepted']: false
                    })

                    if (user) {
                        const company = await companyService.findOne({
                            _id: new Types.ObjectId(companyRef),
                            ['users.element']: user._id
                        })

                        if (user && company) {
                            await userService.updateOne(
                                {
                                    _id: new Types.ObjectId(user.id)
                                },
                                {
                                    $set: {
                                        name: {
                                            first: firstName,
                                            last: lastName,
                                            full: fullName
                                        },
                                        password: await hash(password, genSaltSync(10)),
                                        ['info.register.invitation.accepted']: true
                                    }
                                }
                            )

                            res.cookie(
                                'systemData',
                                JSON.stringify({
                                    selectedCompanyId: company._id,
                                    workspaceName: workspaceName
                                }),
                                {
                                    maxAge: TOKEN_EXPIRE,
                                    httpOnly: false
                                }
                            )

                            res.status(200).json({
                                success: true,
                                user: {
                                    name: {
                                        first: firstName,
                                        last: lastName,
                                        full: fullName
                                    },
                                    email: email
                                },
                                company: {
                                    _id: company._id,
                                    name: companyName,
                                    workspaceName: workspaceName
                                }
                            })
                        } else {
                            return res.status(400).json({ message: 'Workspace already exists' })
                        }
                    } else {
                        return res.status(400).json({ message: 'Workspace already exists' })
                    }
                } else {
                    const userId = new Types.ObjectId()
                    const companyId = new Types.ObjectId()
                    const newUser: any = {
                        _id: userId,
                        name: {
                            first: firstName,
                            last: lastName,
                            full: fullName
                        },
                        workspaceName: workspaceName,
                        companies: [
                            {
                                element: companyId,
                                addedAt: moment().toDate()
                            }
                        ],
                        email: email,
                        password: await hash(password, genSaltSync(10))
                    }

                    const newCompany: any = {
                        _id: companyId,
                        name: companyName,
                        createdBy: userId,
                        workspaceName: workspaceName,
                        users: [
                            {
                                element: userId,
                                addedAt: moment().toDate()
                            }
                        ]
                    }

                    if (isTrial) {
                        newUser.info = {
                            register: {
                                method: 'trial'
                            }
                        }
                    }

                    newCompany.info = {
                        trial: {
                            used: true,
                            expiresIn: moment().add(10, 'days').endOf('day')
                        }
                    }

                    newUser.rights = TRIAL_USER_RIGHTS

                    await userService.create(newUser)
                    await companyService.create(newCompany)

                    res.cookie(
                        'systemData',
                        JSON.stringify({
                            selectedCompanyId: companyId,
                            workspaceName: workspaceName
                        }),
                        {
                            maxAge: TOKEN_EXPIRE,
                            httpOnly: false
                        }
                    )

                    res.status(200).json({
                        success: true,
                        isTrial: isTrial,
                        user: {
                            name: {
                                first: firstName,
                                last: lastName,
                                full: fullName
                            },
                            email: email
                        },
                        company: {
                            _id: companyId,
                            name: companyName,
                            workspaceName: workspaceName
                        }
                    })

                    if (isTrial) {
                        await MailService.sendMail({
                            to: email,
                            from: email,
                            subject: 'Дякуємо за реєстрацію',
                            html: `
                                <h1>Шановний клієнте</h1>

                                <p>Дякуємо за інтерес до нашої BCS системи. Ми раді повідомити, що Ви отримали доступ до пробного періоду на 10 днів.</p>

                                <p>Ваш обліковий запис дійсний протягом 10 днів, після чого Ви зможете продовжити використання BCS системи за плату. Якщо у вас виникнуть будь-які питання, будь ласка, зверніться до нашої служби підтримки.</p>

                                <p>Дякуємо, що обрали BCS систему.</p>

                                <p>
                                    З повагою,
                                    Команда BCS системи <br>
                                </p>

                            `
                        })
                    }
                }
            } else {
                res.status(400).json({ message: 'Wrong password' })
            }
        } else {
            return res.status(400).json({ message: 'Email is not valid' })
        }
    } catch (error) {
        serverError(res, error)
    }
})

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password, workspaceName, selectedCompanyId } = req.body

        if (!isEmail(email)) {
            return res.status(401).json({ message: 'Wrong email' })
        }

        if (!password ?? isStrongPassword(password)) {
            return res.status(400).json({
                message: 'Wrong password'
            })
        }

        const db = connection.useDb(workspaceName)
        const isWorkspaceExists = await checkExistWorkspace(workspaceName)

        if (isWorkspaceExists) {
            const userService = new DBService({
                connection: db,
                schemaName: 'User',
                registerSchemas: ['Company']
            })
            const companyService = new DBService({
                connection: db,
                schemaName: 'Company'
            })
            const candidate = await userService
                .findOne({
                    email: email,
                    workspaceName: workspaceName
                })
                .populate({
                    path: 'companies',
                    populate: {
                        path: 'element',
                        select: DEFAULT_COMPANIES_FIELDS
                    }
                })

            if (candidate && candidate.companies?.length > 0) {
                if (await candidate.comparePassword(password)) {
                    if (selectedCompanyId) {
                        const isBelongToCompany = candidate.companies.find(
                            (element: any) => element?._id ?? element === selectedCompanyId
                        )

                        if (isBelongToCompany) {
                            if (
                                candidate.hasSystemRight({
                                    rightPath: 'access.entrance',
                                    mustEqualTo: true
                                })
                            ) {
                                const company = await companyService.findOne({
                                    _id: new Types.ObjectId(selectedCompanyId)
                                })                               

                                if (company) {
                                    if (
                                        moment().isAfter(moment(company.info.payment.expiresIn)) &&
                                        moment().isAfter(moment(company.info.trial.expiresIn))
                                    ) {
                                        if (!company.info.payment.notifications?.email?.sended) {
                                            await MailService.sendMail({
                                                to: email,
                                                from: email,
                                                subject:
                                                    'Період використання BCS системи незабаром закінчиться',
                                                html: `
                                                <h1>Шановний клієнте</h1>

                                                <p>Хочемо повідомити Вас, що оплачений Вами період використання BCS системи незабаром закінчиться. Для продовження використання BCS системи, необхідно оформити плату за наступний період <a href="http://business-control-system.com">на сайті</a>.</p>
                                                <p>Нагадуємо, що BCS система- це надійна система управління бізнесом та взаємодією з клієнтами, яка допомагає підтримувати високу якість обслуговування та розширювати клієнтську базу. Ми рекомендуємо продовжити використання BCS системи, щоб забезпечити ефективну роботу Вашої компанії.</p>
                                                <p>Будь ласка, скористайтеся нашим посиланням на сторінку оплати, щоб продовжити використання BCS системи. Ми готові надати вам допомогу в разі виникнення будь-яких питань.</p>
                                                <br>
                                                <p>Дякуємо за використання BCS системи.</p>
                                                <br>
                                                <p>
                                                    З повагою,
                                                    Команда BCS системи <br>
                                                </p>
                                            `
                                            })

                                            await companyService.updateOne(
                                                {
                                                    _id: new Types.ObjectId(selectedCompanyId)
                                                },
                                                {
                                                    'info.payment.notifications.email': {
                                                        sended: true,
                                                        sendedAt: moment().toDate()
                                                    }
                                                }
                                            )
                                        }

                                        return res.status(401).json({
                                            state: 'paymentExpired',
                                            message: 'Payment has been expired'
                                        })
                                    } else if (
                                        moment()
                                            .add(3, 'days')
                                            .isAfter(moment(company.info.trial.expiresIn)) &&
                                        !company.info.trial.notifications?.email?.sended
                                    ) {
                                        await MailService.sendMail({
                                            to: email,
                                            from: email,
                                            subject:
                                                'Ваш пробний період закінчується через декілька днів',
                                            html: `
                                            <h1>Шановний клієнте</h1>
                                            <p>Дякуємо за те, що скористалися пробним періодом використання BCS системи. Нагадуємо, що ваш пробний період закінчується через декілька днів, і якщо Ви бажаєте продовжити використання нашої CRM, необхідно здійснити оплату.</p>
                                            <p>Ми надаємо різні тарифні плани для використання BCS системи, в залежності від Ваших потреб та обсягів використання. Для ознайомлення з тарифами та оплатою, будь ласка, скористайтеся наступним посиланням: <a href="http://business-control-system.com">на сайт</a></p>
                                            <p>Якщо Ви маєте будь-які запитання, не соромтеся звертатися до нашої служби підтримки. Ми завжди готові допомогти вам з будь-якими питаннями, які виникають під час використання BCS системи.</p>
                                            <p>Дякуємо за використання BCS системи.</p>
                                            
                                            <p>
                                                З повагою,
                                                Команда BCS системи <br>
                                            </p>
                                        `
                                        })

                                        await companyService.updateOne(
                                            {
                                                _id: new Types.ObjectId(selectedCompanyId)
                                            },
                                            {
                                                'info.trial.notifications.email': {
                                                    sended: true,
                                                    sendedAt: moment().toDate()
                                                }
                                            }
                                        )
                                    }

                                    const token = sign(
                                        {
                                            userId: candidate._id,
                                            companyId: selectedCompanyId,
                                            workspaceName: workspaceName
                                        },
                                        environment.jwt,
                                        { expiresIn: TOKEN_EXPIRE }
                                    )

                                    res.status(200).json({
                                        user: {
                                            email: candidate.email,
                                            name: candidate.name,
                                            workspaceName: candidate.workspaceName
                                        },
                                        token: token
                                    })
                                } else {
                                    res.status(404).json({
                                    message: 'Company no found',
                                    state: 'companyNotFound'
                                })
                                }
                            } else {
                                res.status(401).json({
                                    message: 'You has no right',
                                    state: 'hasNoRight'
                                })
                            }
                        } else {
                            res.status(200).json({
                                message: 'Select company',
                                state: 'selectCompany',
                                companies: candidate.companies
                            })
                        }
                    } else {
                        res.status(200).json({
                            message: 'Select company',
                            state: 'selectCompany',
                            companies: candidate.companies
                        })
                    }
                } else {
                    res.status(401).json({ message: 'Wrong password' })
                }
            } else {
                res.status(404).json({ message: 'User not found' })
            }
        } else {
            res.status(404).json({
                message: 'Workspace does not exist'
            })
        }
    } catch (error) {
        serverError(res, error)
    }
})

function getVerificationCode(): string {
    const code = []
    while (code.length !== 5) {
        code.push(Math.floor(Math.random() * 10))
    }

    return code.join(' ')
}

export default router
