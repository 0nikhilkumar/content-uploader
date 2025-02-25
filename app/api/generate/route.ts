import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request:  NextRequest) {
    try {
        const { image, imageType, type } = await request.json();

        if(!image || !imageType) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        let PROMPT="";
        if(type==="title"){
            PROMPT = `Write a 5 to 6 word genuine title realted to given image`;
        }
        else if(type==="description"){
            PROMPT = `Write a 1 or 2 line genuine description realted to given image`;
        }
        else{
            return NextResponse.json({error: "Invalid type"}, {status: 400});
        }

        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash", systemInstruction: PROMPT});

        const imageArray = [image, imageType];

        const result = await model.generateContent([...imageArray]);
        const textResponse = await result.response.text();
        return NextResponse.json(textResponse, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Failed to generate image"}, {status: 500});
    }
}