import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
    region: process.env.AWS_REGION_NAME as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('images') as File[];

        const uploadPromises = files.map(async (file) => {
            const buffer = await file.arrayBuffer();
            const fileExtension = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME as string,
                Key: fileName,
                Body: Buffer.from(buffer),
                ContentType: file.type,
            };

            const command = new PutObjectCommand(params);
            await s3Client.send(command);

            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION_NAME}.amazonaws.com/${fileName}`;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        console.log(uploadedUrls);
        return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
    } catch (error) {
        console.error('Error uploading images:', error);
        return NextResponse.json({ error: 'Failed to upload images' }, { status: 500 });
    }
}