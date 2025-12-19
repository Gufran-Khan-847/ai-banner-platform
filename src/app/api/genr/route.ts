import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    const { userImgS3Links, userPrompt, colorPallete, theme } = await request.json()
    const BACKEND_COMPLETION_URL = 'http://127.0.0.1:5000/prompt'
    const { data } = await axios.post(BACKEND_COMPLETION_URL, {
        "offer": userPrompt,
        "images": userImgS3Links,
        "colors_pallete": colorPallete,
        "theme": theme,
    })
    console.log(data)
    return NextResponse.json({
        status: 200,
        body: data,
    })
}