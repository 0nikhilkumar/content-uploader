import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		await connectToDatabase();
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
		const video = await Video.findById(id).lean();

		if (!video) {
			return NextResponse.json({ error: "Video not found" }, { status: 404 });
		}

		return NextResponse.json(video);
	} catch (error) {
		console.error("Error fetching video:", error);
		return NextResponse.json(
			{ error: "Failed to fetch video" },
			{ status: 500 }
		);
	}
}
