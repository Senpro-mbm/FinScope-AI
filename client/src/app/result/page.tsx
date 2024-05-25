"use client";

import Button from "@/components/basic/Button";
import Switch from "@/components/basic/Switch";
import NoImage from "@/components/placeholder/NoImage";
import BouncingDotsSpinner from "@/components/spinner/BouncingDotsSpinner";
import { stat } from "fs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function UploadPage() {
  const searchParams = useSearchParams();
  const [resultId, setResultId] = useState<string | null>(null);
  const [result, setResult] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) fetchResult(id);
  }, [searchParams]);

  async function fetchResult(id: string) {
    const response = await fetch("/api/result?id=" + id);
    if (response.status != 200) return;
    const data = await response.json();

    if (!data.result.result) return;
    setResult(data.result.result);
  }

  function onToggleHandler(state: boolean) {
    if (state)
      setResult(
        resultId + "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      );
    else setResult(undefined);
  }

  return (
    <div className="flex flex-col p-12 gap-y-6">
      <div className="flex flex-row items-center gap-x-2 hidden">
        <Switch onToggle={onToggleHandler} />
        <p className="text-lg">Result is {result == undefined ? "hidden" : "shown"}</p>
      </div>
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
          <p className="text-lg">{result}</p>
        )}
      </div>
      <Link href="/upload">
        <Button>Analyze More</Button>
      </Link>
    </div>
  );
}