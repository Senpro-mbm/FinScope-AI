import dbConnect from "@/lib/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Stock from "@/models/stock";

export async function GET(req: NextRequest) {
  await dbConnect();

  const stocks = await Stock.find({});

  return new Response(JSON.stringify(stocks), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}
