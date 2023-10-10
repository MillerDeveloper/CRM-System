import { Response } from 'express'

export function serverError(res: Response, error: any): void {
    console.error('Error', error)

    res.status(500).json({
        message: error.message || error
    })
}
