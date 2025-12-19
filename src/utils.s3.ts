import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

// dotenv.config();

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION_NAME = process.env.AWS_REGION_NAME;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Create a session using your credentials
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION_NAME
});

// Create an S3 client
const s3 = new AWS.S3();

export class S3Operations {
    constructor() { }

    async getAllBucketNames(): Promise<string[]> {
        const response = await s3.listBuckets().promise();
        return response.Buckets?.map(bucket => bucket.Name as string) || [];
    }

    async getAllObjects(bucketName: string = AWS_BUCKET_NAME as string): Promise<string[]> {
        const response = await s3.listObjectsV2({ Bucket: bucketName }).promise();
        return response.Contents?.map(obj => obj.Key as string) || [];
    }

    async getObject(objectKey: string, bucketName: string = AWS_BUCKET_NAME as string): Promise<AWS.S3.GetObjectOutput> {
        try {
            return await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
        } catch (error) {
            if (error instanceof Error && error.name === 'NoSuchKey') {
                throw new Error(`Object with key '${objectKey}' not found in bucket '${bucketName}'`);
            }
            throw new Error(`Error retrieving object from S3: ${error}`);
        }
    }

    async uploadObject(objectKey: string, filePath: string, bucketName: string = AWS_BUCKET_NAME as string): Promise<string> {
        const absFilePath = path.resolve(filePath);

        if (!fs.existsSync(absFilePath)) {
            throw new Error(`The file ${absFilePath} does not exist.`);
        }

        try {
            await s3.upload({
                Bucket: bucketName,
                Key: objectKey,
                Body: fs.createReadStream(absFilePath)
            }).promise();

            console.log(`Successfully uploaded ${absFilePath} to ${bucketName}/${objectKey}`);
            const imgUrl = `https://${bucketName}.s3.${AWS_REGION_NAME}.amazonaws.com/${objectKey}`;
            return imgUrl;
        } catch (error) {
            throw new Error(`Error uploading file to S3: ${error}`);
        }
    }

    async downloadObject(objectKey: string, bucketName: string = AWS_BUCKET_NAME as string): Promise<Buffer> {
        const response = await s3.getObject({ Bucket: bucketName, Key: objectKey }).promise();
        return response.Body as Buffer;
    }

    async deleteObject(objectKey: string, bucketName: string = AWS_BUCKET_NAME as string): Promise<AWS.S3.DeleteObjectOutput> {
        return await s3.deleteObject({ Bucket: bucketName, Key: objectKey }).promise();
    }

    async deleteBucket(bucketName: string = AWS_BUCKET_NAME as string): Promise<object> {
        return await s3.deleteBucket({ Bucket: bucketName }).promise();
    }

    async createBucket(bucketName: string = AWS_BUCKET_NAME as string): Promise<AWS.S3.CreateBucketOutput> {
        return await s3.createBucket({
            Bucket: bucketName,
            CreateBucketConfiguration: { LocationConstraint: AWS_REGION_NAME }
        }).promise();
    }

    async copyObject(sourceBucketName: string, sourceObjectKey: string, destinationBucketName: string, destinationObjectKey: string): Promise<AWS.S3.CopyObjectOutput> {
        return await s3.copyObject({
            Bucket: destinationBucketName,
            CopySource: `${sourceBucketName}/${sourceObjectKey}`,
            Key: destinationObjectKey
        }).promise();
    }

    async moveObject(sourceBucketName: string, sourceObjectKey: string, destinationBucketName: string, destinationObjectKey: string): Promise<AWS.S3.DeleteObjectOutput> {
        await this.copyObject(sourceBucketName, sourceObjectKey, destinationBucketName, destinationObjectKey);
        return await this.deleteObject(sourceObjectKey, sourceBucketName);
    }
}

const myS3 = new S3Operations();

// Example usage:
(async () => {
    try {
        const files = await myS3.getAllObjects('gen-ai-hacks');
        console.log(`Got the files: ${files}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`An error occurred: ${error.message}`);
        } else {
            console.error(`An unknown error occurred`);
        }
    }
})();