import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextResponse } from "next/server";

export async function GET({params}: {params: {id: string}}) {
	try {
		await connectToDatabase();

		const video = await Video.findById(params.id).lean();

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
