import { imagekit } from "@/lib/imagekit";
import { NextResponse } from "next/server";


// export const imagekit = new ImageKit({
//     publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
//     privateKey: process.env.PRIVATE_KEY!,
//     urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
// });

export async function GET() {
    try {
        const imageAuthenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(imageAuthenticationParameters);   
    } catch (error) {
        return NextResponse.json({error: "ImageKit Auth failed"}, {status: 500})
    }
}