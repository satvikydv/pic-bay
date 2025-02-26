import Product, { IProduct } from "@/models/Product";
import { authOptions } from "@/utils/auth";
import { connectToDatabase } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectToDatabase();
        
        const products = await Product.find({}).lean();
        // console.log("product: ", products);
        if(!products || products.length === 0){
            return NextResponse.json([], {status: 404});
        }

        return NextResponse.json(products, {status: 200});  //bug fix
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

export async function POST(request: Request){
    try {
        const session = await getServerSession(authOptions)

        if(!session || session.user?.role !== "admin"){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        await connectToDatabase();

        const body: IProduct = await request.json();

        if(
            !body.name || !body.description || !body.imageUrl || body.variants.length === 0
        ){
            return NextResponse.json({error: "Please provide all required fields"}, {status: 400});
        }

        const newProduct = await Product.create(body);
        return NextResponse.json({newProduct}, {status: 201});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}