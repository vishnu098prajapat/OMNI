"use client";

import { BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function AppHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Ensure light mode is clean
    document.documentElement.classList.remove('dark');

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-6 sm:px-12 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'}`}>
      <Link href="/" className="flex items-center gap-3 cursor-pointer">
        <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#0ea5e9] shadow-md">
          <BrainCircuit className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <span className="text-xl font-black tracking-tight text-slate-900">Omni</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link href="/#tools" className="hover:text-slate-900 transition-colors">Tools</Link>
          <Link href="/#contact" className="hover:text-slate-900 transition-colors">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
