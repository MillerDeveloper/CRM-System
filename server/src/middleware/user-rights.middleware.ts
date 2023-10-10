import { serverError } from '@/utils/error-handler.util'
import { Types } from 'mongoose'
import { DBService } from '@services/global/db.service'
import { hasCollectionRight, hasSystemRight } from '@globalShared/utils/system.utils'
import { Request, Response, NextFunction } from 'express'

export function checkUserRights(
    rightType: 'system' | 'collections',
    config: {
        right?: 'create' | 'update' | 'delete' | 'edit' | 'view'
        mustEqualTo?: any
        mustNotEqualTo?: any
        rightPath?: string | any
    }
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(400).json({ error: 'User not found' })
            }

            const userService = new DBService({ connection: req.user, schemaName: 'User' })
            const user = await userService.findOne({ _id: new Types.ObjectId(req.user.userId) })

            switch (rightType) {
                case 'system': {
                    const hasRight = hasSystemRight({
                        rightPath: config.rightPath,
                        mustEqualTo: config.mustEqualTo,
                        mustNotEqualTo: config.mustNotEqualTo,
                        rights: user.rights[rightType]
                    })

                    return hasRight ? next() : res.status(400).json({ error: 'Not enough rights' })
                }
                case 'collections': {
                    const hasRight = hasCollectionRight({
                        collectionId: new Types.ObjectId(req.params.collectionId || req.params.id),
                        mustEqualTo: config.mustEqualTo,
                        mustNotEqualTo: config.mustNotEqualTo,
                        right: config.right,
                        rights: user.rights[rightType]
                    })

                    return hasRight ? next() : res.status(400).json({ error: 'Not enough rights' })
                }
            }
        } catch (error) {
            serverError(res, error)
        }
    }
}
