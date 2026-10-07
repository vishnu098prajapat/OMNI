"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Zap, FileText, Minimize2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { API_URL } from "@/lib/api";

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: FileList | File[]) => {
    setError(null);
    const valid = Array.from(newFiles).find(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!valid) {
      setError("Please select a valid PDF file.");
      return;
    }
    setFile(valid);
  };

  const handleCompress = async () => {
    if (!file) {
      setError("Please select a PDF file to compress.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/api/tools/compress`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to compress file");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Omni_Compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden flex flex-col pt-16">
      
      <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-sky-50/50 dark:from-sky-900/20 to-transparent -z-10 pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center pb-20 pt-8 px-4 sm:px-6">
        <div className="w-full max-w-[1000px] flex flex-col items-center">
          
          <div className="w-full flex items-center justify-center relative mb-8">
            <Link href="/#tools" className="absolute left-0 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium text-sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Tools
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-sky-900/30 pl-1 pr-4 py-1 border border-sky-100 dark:border-sky-800 shadow-sm">
              <span className="bg-sky-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full"><Minimize2 className="w-3 h-3 inline-block mr-1"/>Power Tool</span>
              <span className="text-sm font-medium text-sky-700 dark:text-sky-300">Lossless Compression</span>
            </div>
          </div>

          <div className="text-center mb-8 w-full">
            <div className="max-w-[1200px] mx-auto mb-4 w-full">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white leading-[1.1]">
                <span className="whitespace-nowrap block">Compress PDFs</span>
                <span className="text-sky-500 italic pr-2">without</span> 
                <span className="relative z-10 inline-block">
                  losing quality.
                  <span className="absolute bottom-1 left-0 w-full h-[20px] bg-amber-300/60 dark:bg-amber-300/30 -z-10 rounded-sm transform -rotate-1"></span>
                </span>
              </h1>
            </div>
            <p className="max-w-xl mx-auto text-base md:text-lg text-[#6B7280] dark:text-slate-400 leading-relaxed mt-4">
              Reduce huge file sizes heavily using our garbage-collection engine. Ideal for email limits. 100% Private.
            </p>
          </div>
        
        <div className="w-full max-w-md mx-auto">
          
          <div
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => !file && fileRef.current?.click()}
            className={`group relative rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 shadow-sm ${!file && "hover:shadow-lg hover:-translate-y-1"} ${
              dragOver ? "border-sky-500 bg-sky-50/80 dark:bg-sky-900/30 scale-[1.02] shadow-md -translate-y-1" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            } ${!file ? "cursor-pointer" : ""}`}
          >
            {!file ? (
              <>
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
                  dragOver ? "bg-sky-600 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900/50" : "bg-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 group-hover:bg-sky-100 dark:group-hover:bg-sky-800/60"
                }`}>
                  <FileText className="w-7 h-7" />
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-white mb-1.5 transition-colors group-hover:text-sky-600 dark:group-hover:text-sky-400">Drag & drop your PDF</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-0">or click to browse</p>
              </>
            ) : (
              <div className="text-left w-full flex flex-col gap-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">Ready to compress</h3>
                  <button onClick={() => fileRef.current?.click()} className="text-sm font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
                    Change File
                  </button>
                </div>
                
                <div className="relative rounded-xl">
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 z-10 bg-[#FAF8F5]/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-sky-100 shadow-inner"
                    >
                      <div className="relative flex items-center justify-center mb-4 mt-2">
                        <div className="absolute w-12 h-12 border-4 border-sky-200 rounded-full"></div>
                        <div className="absolute w-12 h-12 border-4 border-sky-500 rounded-full border-t-transparent animate-spin"></div>
                        <Minimize2 className="w-5 h-5 text-sky-600 animate-pulse" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">Compressing...</p>
                      <p className="text-xs text-slate-500 font-medium mt-1 mb-2">Stripping dead objects & deflating streams</p>
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm transition-colors ${loading ? "opacity-40 grayscale" : "hover:border-sky-300"}`}
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700 truncate">{file.name}</span>
                          <span className="text-xs text-slate-400 font-medium">{formatSize(file.size)}</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {error && <p className="mt-2 text-sm font-semibold text-red-500 bg-red-50 py-2 px-3 rounded-lg border border-red-100">{error}</p>}
                
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCompress(); }}
                    disabled={loading}
                    className="bg-[#111827] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-black transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> Optimizing...</>
                    ) : (
                      <>Compress File</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden"
            onChange={(e) => e.target.files && handleFileChange(e.target.files)} />
          
        </div>
      </div>
    </div>
  </main>
);
}


