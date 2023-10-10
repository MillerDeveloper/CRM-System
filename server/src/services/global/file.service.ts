import { getConnection } from '@services/global/db.service'
import { Connection, Types } from 'mongoose'
import { IRequestData } from '@globalShared/interfaces/system.interface'
import { GridFSBucket } from 'mongodb'
import { createReadStream, createWriteStream, existsSync } from 'fs'
import { environment } from '@/shared/enviroment'
import { writeFile } from 'fs/promises'
import { Router, Request, Response } from 'express'

const BUCKET_NAME = 'uploads'

interface ISchemaFilter {
    [key: string]: any
}

export class FileService {
    bucket!: GridFSBucket
    connection!: Connection

    constructor(config: { connection: IRequestData }) {
        this.connection = getConnection(config.connection)
        this.bucket = new GridFSBucket(this.connection.db, {
            bucketName: BUCKET_NAME
        })
    }

    findMany(filter: ISchemaFilter) {
        if ('metadata.path' in filter) {
            filter['metadata.path'] = new RegExp(filter['metadata.path'], 'g')
        }

        return this.bucket.find(filter).toArray()
    }

    async upload(file: any, metadata: any) {
        await writeFile(environment.pathToUploads, file.data)

        const fileId = new Types.ObjectId()
        const filename = file.name
        return new Promise((resolve, reject) => {
            const stream$ = createReadStream(environment.pathToUploads).pipe(
                this.bucket.openUploadStreamWithId(fileId, filename, {
                    metadata: metadata
                })
            )

            stream$.on('close', () => {
                resolve({ ...file, _id: fileId })
            })

            stream$.on('error', (error: any) => {
                reject(error)
            })
        })
    }

    openDownloadStream(id: string | any) {
        return this.bucket.openDownloadStream(new Types.ObjectId(id))
    }

    deleteOne(id: string) {
        return this.bucket.delete(new Types.ObjectId(id))
    }
}
