import Order from "@/models/Order";
import { authOptions } from "@/utils/auth";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectToDatabase();
        const orders = await Order.find({ userId: session.user.id })
            .populate({
                path: "productId",
                select: "name imageUrl",
                options: { strictPopulate: false },
            })
            .sort({ createdAt: -1 })
            .lean();
            // console.log("orders: ", orders);
            return NextResponse.json(orders, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
