"use client";

import { Suspense, useEffect, useState } from "react";
import EntireResultPage from "@/components/result_page/EntireResultPage";

export default function ResultPage() {
  return (
    <Suspense>
      <EntireResultPage />
    </Suspense>
  );
}
