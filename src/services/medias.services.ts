import { Request } from 'express'
import { config } from 'dotenv'
import fsPromise from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import mime from 'mime'

import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaTypes } from '~/constants/enums'
import { Media } from '~/models/Types'
import { getNameFromFilename, handleUploadImage } from '~/utils/file'
import { uploadToS3 } from '~/utils/s3'

config()

class MediaService {
    async uploadImage({
        req,
        maxFiles,
        maxFileSize = 20 * 1024 * 1024 // 20mb
    }: {
        req: Request
        maxFiles: number
        maxFileSize?: number
    }) {
        const files = await handleUploadImage({ req, maxFiles, maxFileSize })
        const result: Media[] = []

        for (const file of files) {
            const newFilename = `${getNameFromFilename(file.newFilename)}.jpeg`
            const newFilepath = path.resolve(UPLOAD_IMAGE_DIR, newFilename)

            await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newFilepath)
            sharp.cache(false)

            await uploadToS3({
                filename: `images/${newFilename}`,
                filepath: newFilepath,
                contentType: mime.getType(newFilepath) as string
            })

            await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newFilepath)])

            result.push({
                url: `${process.env.HOST}/static/image/${newFilename}`,
                type: MediaTypes.Image
            })
        }

        return result
    }
}

const mediaService = new MediaService()

export default mediaService
