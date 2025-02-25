import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params}: {params: {id: string}}) {
	try {
		await connectToDatabase();
        const { id } = await params;
		const video = await Video.findById(id);
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
