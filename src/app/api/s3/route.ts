import fs from 'fs/promises';
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export const POST = async (request: NextRequest) => {
    const { url } = await request.json()
    const uuid = uuidv4()
    // Download the url and save it in a folder ./tmp/uuid
    const tmpDir = "public/tmp"
    const filePath = `${tmpDir}/${uuid}.png`

    await fs.mkdir(tmpDir, { recursive: true })

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image as a buffer
    const imageBuffer = await response.arrayBuffer();

    // Write the image to the file system
    await fs.writeFile(filePath, Buffer.from(imageBuffer));

    return NextResponse.json({
        message: "Image downloaded successfully",
        uuid: uuid,
        filePath: filePath,
        status: 200
    });

}