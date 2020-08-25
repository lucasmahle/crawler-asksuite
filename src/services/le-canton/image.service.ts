import axion from 'axios';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import { Quotation } from "../../models/quotation.model";
import { OMNIBEES_ENDPOINT, STORE_FOLDER, STORE_URL } from "../../config/config";

const existsAsync = promisify(fs.exists);

export class LeCantonImageService {
    async asyncStoreRoomsImages(quotations: Quotation[]): Promise<Quotation[]> {
        const quotationsPromisses = quotations.map(async (quotation) => {

            const quotationImagesPromisses = quotation.images.map(async (image) => {
                const imageId = this.getImageId(image);

                const originalUrl = OMNIBEES_ENDPOINT + image;
                const storedUrl = STORE_URL + imageId;

                const imageHasCache = await this.imageHasCache(imageId);
                if (!imageHasCache) {
                    const imageCached = await this.downloadImage(originalUrl, imageId);

                    if (!imageCached) {
                        return originalUrl;
                    }
                }

                return storedUrl;
            });

            quotation.images = await (Promise.all(quotationImagesPromisses));

            return quotation;
        })

        return await (Promise.all(quotationsPromisses));
    }

    private getImageId(image: string) {
        const imageIdMatch = /imageID=([0-9\.a-z]+)/.exec(image);

        if (imageIdMatch) {
            return imageIdMatch[1];
        }

        return (new Date).getTime() + '.jpg';
    }

    private async imageHasCache(name: string): Promise<boolean> {
        const imagePath = path.join(STORE_FOLDER, name);

        const exists = await existsAsync(imagePath);
        return exists;
    }

    private async downloadImage(image: string, imageName: string): Promise<boolean> {
        try {
            const imagePath = path.join(STORE_FOLDER, imageName);

            const writer = fs.createWriteStream(imagePath);
            const response = await axion(image, { method: 'GET', responseType: 'stream' });

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(true))
                writer.on('error', () => reject())
            });
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}