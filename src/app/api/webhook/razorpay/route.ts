import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import exp from "constants";
import { connectToDatabase } from "@/utils/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest){
    try {
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature");
        
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex");

        if(expectedSignature !== signature){
            return NextResponse.json({error: "Invalid signature"}, {status: 400});
        }

        const event = JSON.parse(body);
        await connectToDatabase();

        if(event.event === "payment.captured"){
            const payment = event.payload.payment.entity;

            const order = await Order.findOneAndUpdate(
                {razorpayOrderId: payment.order_id},
                {
                    razorpayPaymentId: payment.id,
                    status: "paid"
                }
            ).populate([
                {path: "productId", select: "name"},
                {path: "userId", select: "email"}
            ])

            if(order){
                const transporter = nodemailer.createTransport({
                    service: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: process.env.MAILTRAP_USERNAME,
                        pass: process.env.MAILTRAP_PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: "from@example.com",
                    to: order.userId.email,
                    subject: "Payment Successful",
                    text: `Hi ${order.userId.email}, Your payment for ${order.productId.name} is successful`
                })
            }
        }

        return NextResponse.json({ message: "success" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET() {
    return new Response("Webhook is working", { status: 200 });
}
