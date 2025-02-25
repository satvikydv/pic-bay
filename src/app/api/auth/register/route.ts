import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Validate role (only allow "admin" if authorized)
    let assignedRole = "user"; // Default role
    if (role === "admin") {
      // Ensure only an authorized user can create an admin
      const adminUser = await User.findOne({ role: "admin" });
      if (!adminUser) {
        assignedRole = "admin"; // If no admin exists, allow first admin creation
      } else {
        return NextResponse.json(
          { error: "Only an admin can create another admin" },
          { status: 403 }
        );
      }
    }

    await User.create({
      email,
      password,
      role: assignedRole,
    });

    return NextResponse.json(
      { message: `User registered successfully as ${assignedRole}` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
