import { authOptions } from "@/lib/authOption";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function GET() {
    const session = await getServerSession(authOptions);
    try {
        await connectToDatabase();

        const profile = await User.findById(session?.user.id).lean().select("-password");
        if(!profile) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({error: "Failed to fetch profile"}, {status: 500});
    }
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    try {
        await connectToDatabase();

        const {firstname, lastname, email, bio, avatar, fileId} = await request.json();

        const user = await User.findById(session?.user.id);
        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const existingFileId = user.fileId;

        const updatedUser = await User.findByIdAndUpdate(session?.user.id, {
            firstname,
            lastname,
            email,
            bio,
            avatar,
            fileId
        }, {new: true});

        if(!updatedUser) {
            return NextResponse.json({error: "Failed to update profile"}, {status: 500});
        }

        if(existingFileId) {
            await imagekit.deleteFile(existingFileId);
        }

        return NextResponse.json({
            message: "Profile updated successfully",
        }, {status: 200});

    } catch (error) {
        
    }
}