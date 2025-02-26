import Order from "@/models/Order";
import { authOptions } from "@/utils/auth";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // console.log("request", request);
    const { productId, variant } = await request.json();
    // console.log("order page productId", productId);
    console.log("order page variant", variant);
    await connectToDatabase();

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(variant.price * 100),
      currency: "INR",
      receipt: `receipt-${Date.now()}`,
      notes: {
        productId: productId.toString(),
        variantId: variant._id.toString(),
      },
    });

    console.log("razorpay order", order);

    // Save the order to the database
    const newOrder = await Order.create({
      userId: session.user.id,
      productId,
      variant,
      razorpayOrderId: order.id,
      amount: Math.round(variant.price * 100),
      status: "pending",
    });

    console.log("newOrder ", newOrder);

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        dbOrderId: newOrder._id,
        receipt: order.receipt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}