import { checkExistWorkspace } from '@/utils/db.utils'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { environment } from '@/shared/enviroment'

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('accessToken')
    ]),
    secretOrKey: environment.jwt
}

export function initPassport(passport: any) {
    passport.use(
        new Strategy(options, async (data, done) => {
            try {
                if (await checkExistWorkspace(data.workspaceName)) {
                    done(null, data)
                } else {
                    done(null, false)
                }
            } catch (error) {
                console.error(error)
                done(null, false)
            }
        })
    )
}
