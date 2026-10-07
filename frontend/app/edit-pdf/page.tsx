"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ChevronLeft, Zap, Type, UploadCloud } from "lucide-react";
import { UploadCard } from "@/components/hero-upload";
import { EditWorkbench } from "@/components/edit-workbench";
import { API_URL } from "@/lib/api";

export interface SpanData {
  id: string;
  text: string;
  left_pct: number;
  top_pct: number;
  width_pct: number;
  height_pct: number;
  font_size: number;
  font_family: string;
  color: string;
  is_bold: boolean;
  is_italic: boolean;
}

export default function EditPdfTool() {
  const [extractedData, setExtractedData] = useState<{ filename: string, fileUrl: string, file: File, pages: {page: number, width?: number, height?: number, text: string, spans?: SpanData[]}[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const fileUrl = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/tools/extract-text`, {
        method: "POST",
        body: formData,
      });

      let pages = [{ page: 1, text: "" }];
      if (res.ok) {
        const data = await res.json();
        if (data.pages && data.pages.length > 0) {
          pages = data.pages;
        }
      }
      
      setExtractedData({
        filename: file.name,
        fileUrl: fileUrl,
        file: file,
        pages: pages
      });

    } catch (err: any) {
      // Fallback: even if text extraction fails, still load original PDF preview!
      const fileUrl = URL.createObjectURL(file);
      setExtractedData({
        filename: file.name,
        fileUrl: fileUrl,
        file: file,
        pages: [{ page: 1, text: "" }]
      });
    } finally {
      setLoading(false);
    }
  };

  if (extractedData) {
    return (
      <EditWorkbench 
        filename={extractedData.filename} 
        fileUrl={extractedData.fileUrl}
        file={extractedData.file}
        extractedPages={extractedData.pages} 
        onReset={() => {
          if (extractedData.fileUrl) URL.revokeObjectURL(extractedData.fileUrl);
          setExtractedData(null);
        }} 
      />
    );
  }

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden flex flex-col pt-16">
      <Head>
        <title>Edit PDF | Omni</title>
      </Head>

      <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-teal-50/50 dark:from-teal-900/20 to-transparent -z-10 pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center pb-20 pt-8 px-4 sm:px-6">
        <div className="w-full max-w-[1000px] flex flex-col items-center">
          
          <div className="w-full flex items-center justify-center relative mb-8">
            <Link href="/#tools" className="absolute left-0 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium text-sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Tools
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-900/30 pl-1 pr-4 py-1 border border-teal-100 dark:border-teal-800 shadow-sm">
              <span className="bg-teal-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full"><Type className="w-3 h-3 inline-block mr-1"/>Pro Tool</span>
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Document Editor</span>
            </div>
          </div>

          <div className="text-center mb-8 w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white leading-[1.1]">
              <span className="whitespace-nowrap block">Edit & reformat</span>
              <span className="text-teal-500 italic pr-2">PDF text</span> 
              <span className="relative z-10 inline-block">
                instantly.
                <span className="absolute bottom-1 left-0 w-full h-[20px] bg-amber-300/60 dark:bg-amber-300/30 -z-10 rounded-sm transform -rotate-1"></span>
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-base md:text-lg text-[#6B7280] dark:text-slate-400 leading-relaxed mt-4">
              Extract every single word perfectly, change page colors, modify fonts, and re-export as a pristine PDF document.
            </p>
          </div>
          
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800 font-semibold text-sm">
              {error}
            </div>
          )}

          {loading ? (
             <div className="w-full max-w-lg bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute w-16 h-16 border-4 border-teal-100 dark:border-teal-900 rounded-full"></div>
                  <div className="absolute w-16 h-16 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                  <Type className="w-6 h-6 text-teal-600 dark:text-teal-400 animate-pulse" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-xl mb-2">Extracting all data...</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Reading every word from the document securely.</p>
             </div>
          ) : (
            <UploadCard 
              onReady={(docs) => {}} // We override the file drop manually below 
            />
          )}

          {/* Quick invisible dropzone overlay on UploadCard since we want custom parsing here */}
          {!loading && (
            <div className="absolute inset-x-0 bottom-10 h-64 opacity-0 z-20 flex justify-center">
               <input 
                  type="file" 
                  accept=".pdf"
                  className="w-full max-w-md h-full cursor-pointer"
                  onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                          handleUpload(Array.from(e.target.files));
                      }
                  }}
               />
            </div>
          )}
          
        </div>
      </div>
    </main>
  );
}

