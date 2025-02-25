import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { authOptions } from "@/lib/authOption";
import { imagekit } from "../imagekit-auth/route";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body: IVideo = await request.json();

    // Validate required fields
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new video with default values
    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
      userId: session.user.id,
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
    try {
        await connectToDatabase();

        const {id, title, description} = await request.json();

        if(!id) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const video = await Video.findByIdAndUpdate(id, {
            title,
            description
        });

        if(!video) {
            return NextResponse.json({error: "Video not found"}, {status: 404});
        }

        return NextResponse.json({message: "Video updated successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Failed to update video"}, {status: 500});
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectToDatabase();

        const id = await request.json();
        if(!id) {
            return NextResponse.json({error: "Missing required fields"}, {status: 400});
        }

        const video = await Video.findById(id);
        if(!video) {
            return NextResponse.json({error: "Video not found"}, {status: 404});
        }

        await Video.findByIdAndDelete(id);

        await imagekit.deleteFile(video?.fileId as string);

        return NextResponse.json({message: "Video deleted successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: "Failed to delete video"}, {status: 500});
    }
}