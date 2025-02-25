import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const { email, password, firstname, lastname } = await request.json();
        if(!email || !password || !firstname || !lastname) {
            return NextResponse.json(
              { error: "Missing required fields" },
              { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({email});

        if(user) {
            return NextResponse.json(
              { error: "User already exists" },
              { status: 400 });
        }

        const newUser = await User.create({
            email,
            password,
            firstname,
            lastname
        });


        if(!newUser) {
            return NextResponse.json(
              { error: "Failed to create user" },
              { status: 400 });
        }

        return NextResponse.json(
          { message: "User registered successfully" },
          { status: 201 });
    } catch (error) {
        return NextResponse.json(
          { error: "Failed to register User" },
          { status: 500 }
        )
    }
};
