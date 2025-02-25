import { authOptions } from "@/lib/authOption";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);
    try {
        await connectToDatabase();
        const videos = await Video.find({userId: session?.user.id}).sort({createdAt: -1}).lean();

        if(!videos || videos.length === 0){
            return NextResponse.json([], {status: 200});
        }

        return NextResponse.json(videos);
    } catch (error) {
        return NextResponse.json({error: "Failed to fetch videos"}, {status: 500});
    }
}