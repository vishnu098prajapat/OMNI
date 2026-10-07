"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, Zap, Plus, FileText, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { API_URL } from "@/lib/api";

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (newFiles: FileList | File[]) => {
    setError(null);
    const valid = Array.from(newFiles).filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (valid.length === 0) {
      setError("Please select valid PDF files.");
      return;
    }
    setFiles(prev => [...prev, ...valid]);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("You need at least 2 PDF files to merge.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));

      const res = await fetch(`${API_URL}/api/tools/merge`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || "Failed to merge files");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Omni_Merged.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Keep files in case they want to re-merge or add more
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden flex flex-col pt-16">
      
      <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-emerald-50/50 dark:from-emerald-900/20 to-transparent -z-10 pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center pb-20 pt-8 px-4 sm:px-6">
        <div className="w-full max-w-[1000px] flex flex-col items-center">
          
          <div className="w-full flex items-center justify-center relative mb-8">
            <Link href="/#tools" className="absolute left-0 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium text-sm">
              <ChevronLeft className="w-4 h-4" />
              Back to Tools
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 pl-1 pr-4 py-1 border border-emerald-100 dark:border-emerald-800 shadow-sm">
              <span className="bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full"><Plus className="w-3 h-3 inline-block mr-1"/>Pro Tool</span>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Merge Heavy Files</span>
            </div>
          </div>

          <div className="text-center mb-8 w-full">
            <div className="max-w-[1200px] mx-auto mb-4 w-full">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white leading-[1.1]">
                <span className="whitespace-nowrap block">Combine your</span>
                <span className="text-[#10b981] italic pr-2">PDFs</span> 
                <span className="relative z-10 inline-block">
                  instantly.
                  <span className="absolute bottom-1 left-0 w-full h-[20px] bg-[#FDE047]/60 dark:bg-[#FDE047]/30 -z-10 rounded-sm transform -rotate-1"></span>
                </span>
              </h1>
            </div>
            <p className="max-w-xl mx-auto text-base md:text-lg text-[#6B7280] dark:text-slate-400 leading-relaxed mt-4">
              Merge multiple heavy PDF files into a single document. Zero file-size restrictions. 100% Private.
            </p>
          </div>
        
        <div className="w-full max-w-md mx-auto">
          
          <div
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => files.length === 0 && fileRef.current?.click()}
            className={`group relative rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-all duration-300 shadow-sm ${files.length === 0 && "hover:shadow-lg hover:-translate-y-1"} ${
              dragOver ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-900/30 scale-[1.02] shadow-md -translate-y-1" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            } ${files.length === 0 ? "cursor-pointer" : ""}`}
          >
            {files.length === 0 ? (
              <>
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
                  dragOver ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50" : "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-800/60"
                }`}>
                  <FileText className="w-7 h-7" />
                </div>
                <p className="text-lg font-bold text-slate-800 dark:text-white mb-1.5 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">Drag & drop PDFs to merge</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-0">or click to browse</p>
              </>
            ) : (
              <div className="text-left w-full flex flex-col gap-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">Files to merge ({files.length})</h3>
                  <button onClick={() => fileRef.current?.click()} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    + Add More
                  </button>
                </div>
                
                <div className="relative max-h-[300px] overflow-y-auto space-y-2 pr-2 rounded-xl">
                  {loading && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="absolute inset-0 z-10 bg-[#FAF8F5]/80 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-emerald-100 shadow-inner"
                    >
                      <div className="relative flex items-center justify-center mb-4">
                        <div className="absolute w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
                        <div className="absolute w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                        <FileText className="w-6 h-6 text-emerald-600 animate-pulse" />
                      </div>
                      <p className="text-sm font-bold text-slate-800">Fusing Documents...</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Please wait, allocating memory</p>
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {files.map((f, idx) => (
                      <motion.div 
                        key={`${f.name}-${idx}`}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl shadow-sm group transition-colors ${loading ? "opacity-40 grayscale" : "hover:border-emerald-300"}`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold">{idx + 1}</span>
                          </div>
                          <span className="font-semibold text-slate-700 truncate text-sm">{f.name}</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {error && <p className="mt-2 text-sm font-semibold text-red-500 bg-red-50 py-2 px-3 rounded-lg border border-red-100">{error}</p>}
                
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleMerge(); }}
                    disabled={loading || files.length < 2}
                    className="bg-[#111827] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-black transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> Merging...</>
                    ) : (
                      <>Merge {files.length} PDFs</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <input ref={fileRef} type="file" accept="application/pdf,.pdf" multiple className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)} />
          
        </div>
      </div>
    </div>
  </main>
);
}


