import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_COMPLETION_URL = 'http://localhost:5000/chat-bot'

export async function POST(request: NextRequest) {
    const { message, isImageGeneration, messages } = await request.json()

    const { data } = await axios.post(BACKEND_COMPLETION_URL, {
        "prompt": message,
        "history": messages,
        "is_image": isImageGeneration
    })
    console.log(data)
    return NextResponse.json({
        status: 200,
        body: data.response,
        image: data?.image
    })
}