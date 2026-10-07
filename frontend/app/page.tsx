"use client";

import Link from "next/link";
import { Zap, Play, Star, Brain, Search, Plus, FileText, XCircle, Unlock, Edit3, Moon, Sun, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference on load
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isSystemDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tools = [
    { 
      id: "chat-with-pdf",
      icon: Brain, 
      title: "Chat with Document", 
      desc: "Interact with massive 10,000-page files instantly without limits. Perfect for researchers and students.",
      href: "/chat-with-pdf",
      badge: "Flagship",
      colorClass: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
      hoverBgClass: "group-hover:bg-indigo-500",
      borderHoverClass: "hover:border-indigo-200 dark:hover:border-indigo-700"
    },
    { 
      id: "merge",
      icon: Plus, 
      title: "Merge Heavy Files", 
      desc: "Combine 500MB+ documents seamlessly. Zero file-size restrictions.",
      href: "/merge-pdf",
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-900/20",
      hoverBgClass: "group-hover:bg-emerald-500",
      borderHoverClass: "hover:border-emerald-200 dark:hover:border-emerald-700"
    },
    { 
      id: "split",
      icon: FileText, 
      title: "Extract Pages", 
      desc: "Split or pull out specific pages from heavy books and magazines.",
      href: "/extract-pdf",
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-900/20",
      hoverBgClass: "group-hover:bg-amber-500",
      borderHoverClass: "hover:border-amber-200 dark:hover:border-amber-700"
    },
    { 
      id: "edit",
      icon: Edit3, 
      title: "Document Editor", 
      desc: "Extract perfect text from PDF, format it, style it, and re-export instantly.",
      href: "/edit-pdf",
      colorClass: "text-teal-600 dark:text-teal-400",
      bgClass: "bg-teal-50 dark:bg-teal-900/20",
      hoverBgClass: "group-hover:bg-teal-500",
      borderHoverClass: "hover:border-teal-200 dark:hover:border-teal-700"
    },
    { 
      id: "compress",
      icon: Zap, 
      title: "Compress Document", 
      desc: "Reduce huge file sizes heavily without losing visual quality.",
      href: "/compress-pdf",
      colorClass: "text-sky-600 dark:text-sky-400",
      bgClass: "bg-sky-50 dark:bg-sky-900/20",
      hoverBgClass: "group-hover:bg-sky-500",
      borderHoverClass: "hover:border-sky-200 dark:hover:border-sky-700"
    },
    { 
      id: "unlock",
      icon: XCircle, 
      title: "Unlock & Decrypt", 
      desc: "Remove passwords from protected files in bulk securely.",
      href: "/unlock-pdf",
      colorClass: "text-fuchsia-600 dark:text-fuchsia-400",
      bgClass: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
      hoverBgClass: "group-hover:bg-fuchsia-500",
      borderHoverClass: "hover:border-fuchsia-200 dark:hover:border-fuchsia-700"
    },
  ];

  return (
    <main className="min-h-screen bg-transparent transition-colors duration-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Hero Section */}
      <section className="relative pt-[90px] pb-12 px-6 flex flex-col items-center justify-center text-center">
        
        {/* Badge */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-[#F3F4F6] dark:bg-slate-800 pl-1 pr-4 py-1 hover:bg-[#E5E7EB] dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">New</span>
          <span className="text-sm font-medium text-[#4B5563] dark:text-slate-300">10,000 page limit unlocked for free &rarr;</span>
        </div>

        {/* Big Bold Headline - Exact 2 lines */}
        <div className="max-w-[1200px] mx-auto mb-6 w-full">
          <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-tight text-[#111827] dark:text-white leading-[1.05]">
            <span className="whitespace-nowrap block">The universal workspace.</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] italic pr-2">No limits.</span> 
            <span className="relative z-10 inline-block">
              No sign-ups.
              <span className="absolute bottom-2 left-0 w-full h-[28px] bg-[#FDE047]/60 dark:bg-[#FDE047]/30 -z-10 rounded-sm transform -rotate-1"></span>
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#6B7280] dark:text-slate-400 leading-relaxed mb-8">
          Omni reads, merges, and analyzes massive documents up to 10,000 pages. 
          Everything runs directly on your machine with zero retention.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <a href="#tools" className="text-base font-bold text-white bg-gradient-to-r from-[#111827] to-[#374151] dark:from-white dark:to-slate-200 dark:text-slate-900 px-8 py-3.5 rounded-full hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg w-full sm:w-auto">
            Start for free
          </a>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 z-${10-i} overflow-hidden`}>
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="Avatar" />
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start text-left">
            <div className="flex gap-1 mb-0.5">
              {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />)}
              <span className="text-xs font-bold text-[#374151] dark:text-slate-200 ml-1">4.9</span>
            </div>
            <span className="text-[11px] text-[#6B7280] dark:text-slate-400">from 4,000+ teams who hate limits</span>
          </div>
        </div>
      </section>

      {/* Tools Grid Section (Directly Below Hero) */}
      <section id="tools" className="max-w-[1280px] mx-auto py-12 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((t) => (
            <Link key={t.id} href={t.href} className={`group relative bg-[#FAF8F5] dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-300 cursor-pointer block overflow-hidden hover:-translate-y-1 hover:shadow-xl ${t.borderHoverClass}`}>
              {t.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#6366F1] to-[#8b5cf6] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm">
                  {t.badge}
                </div>
              )}
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${t.bgClass} ${t.hoverBgClass}`}>
                <t.icon className={`w-6 h-6 transition-colors group-hover:text-white ${t.colorClass}`} />
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-2">{t.title}</h3>
              <p className="text-sm text-[#6B7280] dark:text-slate-400 leading-relaxed">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="border-t border-[#E5E7EB] dark:border-slate-800 py-8 mt-12">
        <p className="text-center text-sm text-[#9CA3AF] dark:text-slate-500">© 2026 Omni. The universal workspace.</p>
      </footer>
    </main>
  );
}

