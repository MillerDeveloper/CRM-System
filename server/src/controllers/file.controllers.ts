import { getModelFilter } from '@globalShared/utils/system.utils'
import { serverError } from '@/utils/error-handler.util'
import { FileService } from '@services/global/file.service'
import { Router, Request, Response } from 'express'
import passport from 'passport'
import { Types } from 'mongoose'
import { contentType } from 'mime-types'

const router = Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const fileService = new FileService({ connection: req.user })
            const filter = getModelFilter(req.query, {
                'metadata.companyRef': req.user.companyId,
                'metadata.workspaceName': req.user.workspaceName
            })
            const path = filter['metadata.path']
            const result: any[] = await fileService.findMany(filter)

            const { files, folders } = result.reduce(
                (acc: { files: any[]; folders: any[] }, element: any) => {
                    if (path === element.metadata.path) {
                        acc.files.push(element)
                    } else {
                        const subtractedPath = element.metadata.path
                            .replace(path, '')
                            .split('/')
                            .filter((path: any) => path.length !== 0)

                        if (subtractedPath.length === 1) {
                            const folderLabel = subtractedPath[0]
                            const index = acc.folders.findIndex(
                                (folder: any) => folder.label === folderLabel
                            )

                            if (index !== -1) {
                                acc.folders[index].quantityFiles++
                            } else {
                                acc.folders.push({
                                    label: folderLabel,
                                    quantityFiles: 1,
                                    path: element.metadata.path,
                                    uploadDate: element.uploadDate
                                })
                            }
                        }
                    }

                    return acc
                },
                { files: [], folders: [] }
            )
            res.status(200).json({ success: true, files: files, folders: folders })
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const fileService = new FileService({ connection: req.user })
            const [file] = await fileService.findMany({ _id: new Types.ObjectId(req.params.id) })

            if (file) {
                res.setHeader('Content-Type', contentType(file.filename) || '')
                res.setHeader('Content-Length', file.length)

                const stream$ = fileService.openDownloadStream(file._id)
                stream$.pipe(res)
            } else {
                res.status(404).json({ message: 'File not found' })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.post(
    ['/upload', '/upload/:id'],
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const fileService = new FileService({ connection: req.user })

            if (req.files) {
                const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file]
                const metadata = {
                    uploadedBy: req.user.userId,
                    companyRef: req.user.companyId,
                    workspaceName: req.user.workspaceName,
                    connection: {
                        to: req.params.id,
                        model: req.query.connectedModel,
                        collectionRef: req.query.collectionRef
                    },
                    path: req.query.path ?? ''
                }

                const uploadedFiles: any[] = []
                for (const file of files) {
                    const fl = await fileService.upload(file, metadata)
                    uploadedFiles.push(fl)
                }

                res.status(200).json({ success: true, files: uploadedFiles })
            } else {
                res.status(400).json({ message: 'File not found' })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

router.delete(
    '/:ids',
    passport.authenticate('jwt', { session: false }),
    async (req: Request, res: Response) => {
        try {
            const fileService = new FileService({
                connection: req.user
            })

            const ids = req.params.ids?.split('|')

            if (ids?.length > 0) {
                for (const id of ids) {
                    await fileService.deleteOne(id)
                }

                res.status(200).json({ message: 'Success' })
            } else {
                res.status(400).json({ message: 'Ids are invalid' })
            }
        } catch (error) {
            serverError(res, error)
        }
    }
)

export default router
