import { Request, Response } from 'express'

import { sendFileFromS3 } from '~/utils/s3'

export const serveImageController = (req: Request, res: Response) => {
    const { name } = req.params

    sendFileFromS3(res, `images/${name}`)
}
