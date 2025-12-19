// pages/api/getPresignedUrl.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function GET(req: NextRequest) {
    const url = new URL(req.url)
    const fileName = url.searchParams.get('fileName') || 'default.png';
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    });

    try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return NextResponse.json({
            url: signedUrl,
            status: 200,
        });
    } catch (err) {
        return NextResponse.json({
            status: 500,
            body: err,
        });
    }
}