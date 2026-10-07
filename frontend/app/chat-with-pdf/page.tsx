"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCard } from "@/components/hero-upload";
import { Workbench } from "@/components/workbench";
import type { DocInfo } from "@/lib/api";
import Link from "next/link";
import { ChevronLeft, Brain, Zap } from "lucide-react";

export default function ChatWithPdfTool() {
  const [docs, setDocs] = useState<DocInfo[] | null>(null);

  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden flex flex-col pt-16">
      

      <AnimatePresence mode="wait">
        {docs === null ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col items-center pb-20 pt-8 px-4 sm:px-6 w-full"
          >
            <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-indigo-50/50 dark:from-indigo-900/20 to-transparent -z-10 pointer-events-none"></div>
            
            <div className="w-full max-w-[1000px] flex flex-col items-center">
              
              <div className="w-full flex items-center justify-center relative mb-8 mt-16">
                <Link href="/#tools" className="absolute left-0 sm:left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium text-sm">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Tools
                </Link>

                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 pl-1 pr-4 py-1 border border-indigo-100 dark:border-indigo-800 shadow-sm">
                  <span className="bg-indigo-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full"><Brain className="w-3 h-3 inline-block mr-1"/>AI Tool</span>
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Chat with PDF</span>
                </div>
              </div>

              <div className="text-center mb-8 w-full">
                <div className="max-w-[1200px] mx-auto mb-4 w-full">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111827] dark:text-white leading-[1.1]">
                    <span className="whitespace-nowrap block">Chat with your</span>
                    <span className="text-[#6366F1] italic pr-2">massive</span> 
                    <span className="relative z-10 inline-block">
                      documents.
                      <span className="absolute bottom-1 left-0 w-full h-[20px] bg-[#FDE047]/60 dark:bg-[#FDE047]/30 -z-10 rounded-sm transform -rotate-1"></span>
                    </span>
                  </h1>
                </div>
                <p className="max-w-xl mx-auto text-base md:text-lg text-[#6B7280] dark:text-slate-400 leading-relaxed mt-4">
                  Drop research papers, manuals, or books up to 10,000 pages. 
                  Omni reads it instantly and answers any question with pinpoint citations.
                </p>
              </div>
              
              <div className="w-full max-w-md mx-auto">
                <UploadCard onReady={setDocs} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="workbench"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen"
          >
            <Workbench docs={docs} onReset={() => setDocs(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}


