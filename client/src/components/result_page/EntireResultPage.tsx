"use client";

import Button from "@/components/basic/Button";
import Switch from "@/components/basic/Switch";
import NoImage from "@/components/placeholder/NoImage";
import BouncingDotsSpinner from "@/components/spinner/BouncingDotsSpinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Markdown from "react-markdown";

export default function EntireResultPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = searchParams.get("id");
    const stocks = searchParams.get("stocks");
    if (id) fetchResult(id);
    else if (stocks) fetchStockResult(stocks);
  }, [searchParams]);

  async function fetchResult(id: string) {
    console.log("Fetching result...");
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_ORIGIN + "/upload_and_search?file_name=" + id);
    if (response.status != 200) return;
    const data = await response.json();
    // console.log(data);
    if (!data.search_results) return;
    setResult(data.search_results);
  }

  async function fetchStockResult(stocks: string) {
    console.log("Fetching result...");
    const stockList = stocks.split(",");
    const body = {
      stock_symbols: stockList,
    };
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API_ORIGIN + "/calculates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.status != 200) return;
    const data = await response.json();
    setResult(data);
  }

  return (
    <div className="flex flex-col p-12 gap-y-6">
      <div className="flex justify-center">{}</div>
      <div className="flex flex-row items-center gap-x-4">
        <div className="aspect-square w-[72px]">
          <NoImage isCircle={true} showMessage={false} />
        </div>
        <p className="font-bold text-2xl">FinScope AI</p>
      </div>
      <div className="py-4 px-6 border-2 border-neutral-800 rounded-xl">
        {result == undefined ? (
          <div className="flex flex-col items-center my-12">
            <BouncingDotsSpinner />
            <p className="text-lg">We are analyzing your document. Please wait...</p>
            <p className="text-lg">Try refreshing this page after a few minutes.</p>
          </div>
        ) : (
          //   <Markdown skipHtml={false}>{result}</Markdown>
          <p>{result}</p>
        )}
      </div>
      <Link href="/upload">
        <Button>Analyze More</Button>
      </Link>
    </div>
  );
}
