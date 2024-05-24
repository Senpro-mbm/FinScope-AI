"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import BrowseFile from "@/components/upload_page/BrowseFile";
import DropFile from "@/components/upload_page/DropFile";
import Link from "next/link";
import QuestionCircle from "@/components/icons/QuestionCircle";
import { useRouter } from "next/navigation";
import Button from "@/components/basic/Button";
import Trash from "@/components/icons/TrashFill";

enum Features {
  Feature1,
  Feature2,
}

interface CompanyData {
  name: string;
}

export default function UploadPage() {
  const router = useRouter();

  const [feature, setFeature] = useState<Features>(Features.Feature2);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [companies, setCompanies] = useState<CompanyData[]>([
    { name: "BNI" },
    { name: "BRI" },
    { name: "BCA" },
    { name: "Mandiri" },
  ]);
  const [selectedCompanies, setSelectedCompanies] = useState<(CompanyData | null)[]>([null]);

  const handleFileSelect = (file: File | undefined) => {
    setFile(file);
  };
  const handleFileDrop = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file && file.type === "application/pdf") {
        setFile(file);
        return;
      }
    }
  };
  const handleSubmit = async () => {
    if (!file) return;
    if (process.env.NEXT_PUBLIC_BACKEND_API_ORIGIN === undefined) {
      alert("Error uploading file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: await file.arrayBuffer(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.id) router.push("/result?id=" + data.id);
      } else alert("Upload failed");
    } catch (e) {
      console.error("Error:", e);
      alert("Error uploading file");
    }
  };
  const handleCompanyChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanies([...selectedCompanies].with(index, companies.find((company) => company.name === event.target.value) || null));
  };
  const handleRemoveCompany = (index: number) => {
    setSelectedCompanies(selectedCompanies.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-row w-full justify-center px-12 pt-12">
        <button
          className={`w-full border-2 border-black p-2 rounded-l-md ${
            feature == Features.Feature1 ? "text-white bg-black" : "text-black bg-white"
          }`}
          onClick={() => {
            if (feature != Features.Feature1) setFeature(Features.Feature1);
          }}
        >
          Feature 1
        </button>
        <button
          className={`w-full border-2 border-black p-2 rounded-r-md ${
            feature == Features.Feature2 ? "text-white bg-black" : "text-black bg-white"
          }`}
          onClick={() => {
            if (feature != Features.Feature2) setFeature(Features.Feature2);
          }}
        >
          Feature 2
        </button>
      </div>
      {feature == Features.Feature1 && (
        <div className="flex flex-col px-12 pt-6 pb-12 gap-y-2">
          <p className="font-bold text-lg">Upload Financial Report</p>
          <BrowseFile file={file} onFileSelect={handleFileSelect} />
          <DropFile onFileDrop={handleFileDrop} />
          <div className="flex flex-row justify-between">
            <div className="flex flex-col sm:flex-row gap-x-8">
              <div className="flex flex-row gap-x-2">
                <input type="checkbox" className="w-4 accent-neutral-800"></input>
                <p className="text-lg">Option 1</p>
              </div>
              <div className="flex flex-row gap-x-2">
                <input type="checkbox" className="w-4 accent-neutral-800"></input>
                <p className="text-lg">Option 2</p>
              </div>
            </div>
            {/* example pdf if needed */}
            <Link href="#">
              <div className="flex flex-row gap-x-2 items-center">
                <QuestionCircle width={20} height={20} />
                {/* <Image src="./icons/question-circle.svg" width={20} height={20} alt="question-mark" /> */}
                <p className="text-lg">Example PDF</p>
              </div>
            </Link>
          </div>
        </div>
      )}
      {feature == Features.Feature2 && (
        <div className="flex flex-col px-12 pt-6 pb-12 gap-y-2 items-center">
          {selectedCompanies.map((company, i) => {
            return (
              <div key={i} className="flex flex-row w-full border-2 rounded-md border-black overflow-hidden">
                <select
                  className="w-full p-4 mr-2 outline-none"
                  value={company?.name ?? companies[0].name}
                  onChange={(event) => handleCompanyChange(i, event)}
                >
                  {companies.map((company, i) => {
                    return <option key={i}>{company?.name ?? ""}</option>;
                  })}
                </select>
                <button className="px-4 bg-red-600" onClick={() => handleRemoveCompany(i)}>
                    <Trash fill="white"/>
                </button>
              </div>
            );
          })}
          <button
            className="rounded-md p-2 border-2 border-black hover:bg-gray-300 w-1/4"
            hidden={selectedCompanies.length >= 5}
            onClick={() => {
              if (selectedCompanies.length < 5) setSelectedCompanies([...selectedCompanies, null]);
            }}
          >
            Add
          </button>
        </div>
      )}
      <div className="px-12">
        <button
          className="text-white bg-neutral-800 w-full py-2 rounded-lg enabled:hover:bg-neutral-900 disabled:opacity-50"
          disabled={
            (feature == Features.Feature1 && file == undefined) ||
            (feature == Features.Feature2 && selectedCompanies.length < 2)
          }
          onClick={handleSubmit}
        >
          Upload
        </button>
      </div>
    </>
  );
}
