import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";

export async function POST(request: NextRequest){
    try {
        await connectToDatabase();
        const {email, password} = await request.json();
        if(!email || !password) {
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            )
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            )
        }

        await User.create({
            email,
            password,
            role: "user"
        })

        return NextResponse.json(
            {message: "User created successfully"},
            {status: 201}
        )
    } catch (error) {
        console.error("Register error: ", error)
        return NextResponse.json(
            {message : "Failed to register user"},
            {status: 500}
        )
    }
}