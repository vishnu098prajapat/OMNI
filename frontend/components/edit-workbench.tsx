"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, Zap, Download, Palette, Type, Settings2, 
  Plus, Trash2, FileText, ZoomIn, ZoomOut, AlignLeft, 
  AlignCenter, AlignRight, AlignJustify, Copy,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Stamp, Image as ImageIcon, Sparkles
} from "lucide-react";

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

export interface EditWorkbenchProps {
  filename: string;
  fileUrl?: string;
  file?: File;
  extractedPages: { page: number; width?: number; height?: number; text: string; spans?: SpanData[] }[];
  onReset: () => void;
}

// ── Interactive Single Span Editable Box with Guaranteed Bounding Box Click Target ──
function EditableSpanBox({
  span,
  onSpanChange
}: {
  span: SpanData;
  onSpanChange: (newText: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      onFocus={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
      onInput={(e) => onSpanChange(e.currentTarget.innerText)}
      title="Click to edit this text"
      className={`absolute transition-all cursor-text select-text border border-dashed text-left ${
        isEditing 
          ? "bg-white text-slate-900 border-teal-600 ring-2 ring-teal-500 shadow-xl z-40 p-0.5 min-w-[60px]" 
          : "border-teal-400/40 bg-teal-50/10 hover:bg-teal-100/60 hover:border-teal-600 hover:shadow-xs z-20"
      }`}
      style={{
        left: `${span.left_pct}%`,
        top: `${span.top_pct}%`,
        width: `${Math.max(span.width_pct, 4)}%`,
        minHeight: `${Math.max(span.height_pct, 2)}%`,
        fontSize: `${Math.max(10, span.font_size * 1.15)}px`,
        color: isEditing ? "#000000" : (span.color || "#000000"),
        fontWeight: span.is_bold ? "bold" : "normal",
        fontStyle: span.is_italic ? "italic" : "normal",
        lineHeight: "1.2",
        wordBreak: "break-word",
        boxSizing: "border-box"
      }}
    >
      {span.text}
    </div>
  );
}

export function EditWorkbench({ filename, fileUrl, file, extractedPages, onReset }: EditWorkbenchProps) {
  const [pagesState, setPagesState] = useState<{ page: number; width?: number; height?: number; text: string; spans?: SpanData[] }[]>(
    extractedPages && extractedPages.length > 0 
      ? extractedPages 
      : [{ page: 1, text: "", spans: [] }]
  );
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  
  // Styling state
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#0E0E0E");
  const [fontFamily, setFontFamily] = useState("Georgia, serif");
  const [fontSize, setFontSize] = useState("14");
  const [lineHeight, setLineHeight] = useState("1.6");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right" | "justify">("left");
  const [pageMargin, setPageMargin] = useState<"standard" | "narrow" | "wide">("standard");

  // Watermark State
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkType, setWatermarkType] = useState<"text" | "image">("text");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkColor, setWatermarkColor] = useState("#94A3B8");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.18);
  const [watermarkFontSize, setWatermarkFontSize] = useState(52);
  const [watermarkAngle, setWatermarkAngle] = useState(-30);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    pageRefs.current = pageRefs.current.slice(0, pagesState.length);
  }, [pagesState.length]);

  const scrollToPage = (index: number) => {
    setActivePageIndex(index);
    const targetRef = pageRefs.current[index];
    if (targetRef) {
      targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSpanChange = (pageIdx: number, spanId: string, newText: string) => {
    const updated = [...pagesState];
    const pageSpans = updated[pageIdx].spans || [];
    const spanIdx = pageSpans.findIndex(s => s.id === spanId);
    if (spanIdx !== -1) {
      pageSpans[spanIdx].text = newText;
      updated[pageIdx].spans = pageSpans;
      setPagesState(updated);
    }
  };

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = e.target.files?.[0];
    if (fileObj) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWatermarkImage(event.target?.result as string);
        setWatermarkType("image");
        setWatermarkEnabled(true);
      };
      reader.readAsDataURL(fileObj);
    }
  };

  const handleAddPage = (index?: number) => {
    const insertAt = index !== undefined ? index + 1 : pagesState.length;
    const newPages = [...pagesState];
    newPages.splice(insertAt, 0, {
      page: insertAt + 1,
      text: "",
      spans: []
    });
    const reindexed = newPages.map((p, idx) => ({ ...p, page: idx + 1 }));
    setPagesState(reindexed);
    setTimeout(() => scrollToPage(insertAt), 100);
  };

  const handleDeletePage = (index: number) => {
    if (pagesState.length <= 1) return;
    const updated = pagesState.filter((_, idx) => idx !== index);
    const reindexed = updated.map((p, idx) => ({ ...p, page: idx + 1 }));
    setPagesState(reindexed);
    setActivePageIndex(Math.max(0, index - 1));
  };

  const handleDuplicatePage = (index: number) => {
    const target = pagesState[index];
    const newPages = [...pagesState];
    newPages.splice(index + 1, 0, {
      page: index + 2,
      text: target.text,
      spans: target.spans ? [...target.spans] : []
    });
    const reindexed = newPages.map((p, idx) => ({ ...p, page: idx + 1 }));
    setPagesState(reindexed);
    setTimeout(() => scrollToPage(index + 1), 100);
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    
    try {
      const html2pdf = require("html2pdf.js");
      const opt = {
        margin:       [0, 0, 0, 0],
        filename:     `Omni_Edited_${filename.replace(/\.pdf$/i, "")}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(previewRef.current).save();
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans overflow-hidden text-slate-800">
      
      {/* ── Top Bar Header ─────────────────────────────────────────────────── */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-50 shadow-xs">
        
        {/* Left: Branding & Back */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-teal-600 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-black tracking-tight text-slate-900 hidden sm:inline-block">Omni</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
          <button 
            onClick={onReset} 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all font-medium text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Tools</span>
          </button>
        </div>

        {/* Center: Filename & Page info */}
        <div className="hidden md:flex items-center gap-2.5 bg-slate-50 px-3.5 py-1 rounded-full border border-slate-200/80">
          <FileText className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-xs font-bold text-slate-800 truncate max-w-[220px]">{filename}</span>
          <span className="text-[10px] font-bold bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
            {pagesState.length} {pagesState.length === 1 ? 'Page' : 'Pages'}
          </span>
        </div>

        {/* Right: Zoom & Export */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200/80">
            <button 
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-semibold text-slate-700 px-2 min-w-[38px] text-center">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(Math.min(120, zoomLevel + 10))}
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-white rounded transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-teal-600 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-teal-700 transition-all flex items-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50"
          >
            {isExporting ? <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" /> : <Download className="w-3.5 h-3.5" />}
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {/* ── Secondary Rich Text Formatting Toolbar ────────────────────────────── */}
      <div className="h-10 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 shrink-0 z-40 shadow-2xs overflow-x-auto">
        
        {/* Formatting Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-md border border-slate-200/80">
            <button onClick={() => execCommand("bold")} className="p-1.5 hover:bg-white hover:text-teal-600 rounded text-slate-600 transition-all font-bold" title="Bold (Ctrl+B)"><Bold className="w-3.5 h-3.5" /></button>
            <button onClick={() => execCommand("italic")} className="p-1.5 hover:bg-white hover:text-teal-600 rounded text-slate-600 transition-all italic" title="Italic (Ctrl+I)"><Italic className="w-3.5 h-3.5" /></button>
            <button onClick={() => execCommand("underline")} className="p-1.5 hover:bg-white hover:text-teal-600 rounded text-slate-600 transition-all underline" title="Underline (Ctrl+U)"><Underline className="w-3.5 h-3.5" /></button>
            <button onClick={() => execCommand("strikeThrough")} className="p-1.5 hover:bg-white hover:text-teal-600 rounded text-slate-600 transition-all line-through" title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* List buttons */}
          <div className="flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-md border border-slate-200/80">
            <button onClick={() => execCommand("insertUnorderedList")} className="p-1.5 hover:bg-white hover:text-teal-600 rounded text-slate-600 transition-all" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
            <button onClick={() => execCommand("insertOrderedList")} className="p-1.5 hover:bg-white hover:text-teal-600 rounded text-slate-600 transition-all" title="Numbered List"><ListOrdered className="w-3.5 h-3.5" /></button>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

          {/* Alignment */}
          <div className="hidden sm:flex items-center gap-0.5 bg-slate-50 p-0.5 rounded-md border border-slate-200/80">
            <button onClick={() => setTextAlign("left")} className={`p-1.5 rounded transition-all ${textAlign === "left" ? "bg-white text-teal-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`} title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
            <button onClick={() => setTextAlign("center")} className={`p-1.5 rounded transition-all ${textAlign === "center" ? "bg-white text-teal-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`} title="Align Center"><AlignCenter className="w-3.5 h-3.5" /></button>
            <button onClick={() => setTextAlign("right")} className={`p-1.5 rounded transition-all ${textAlign === "right" ? "bg-white text-teal-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`} title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
            <button onClick={() => setTextAlign("justify")} className={`p-1.5 rounded transition-all ${textAlign === "justify" ? "bg-white text-teal-600 shadow-2xs" : "text-slate-500 hover:text-slate-900"}`} title="Justify Text"><AlignJustify className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Quick Watermark toggle button */}
        <button
          onClick={() => setWatermarkEnabled(!watermarkEnabled)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all border ${
            watermarkEnabled 
              ? "bg-teal-50 border-teal-300 text-teal-700 shadow-2xs" 
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Stamp className="w-3.5 h-3.5 text-teal-600" />
          <span>Watermark {watermarkEnabled ? "ON" : "OFF"}</span>
        </button>

      </div>

      {/* ── Main Workspace ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT SIDEBAR: Slim Pages Rail (w-44) ───────────────────────── */}
        <div className="w-44 bg-white border-r border-slate-200/80 flex flex-col shrink-0 z-20 hidden md:flex">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pages ({pagesState.length})</span>
            <button 
              onClick={() => handleAddPage()}
              className="p-1 text-teal-600 hover:bg-teal-50 rounded transition-colors"
              title="Add Page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Thumbnail list */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            {pagesState.map((p, idx) => {
              const isActive = activePageIndex === idx;
              return (
                <div 
                  key={idx}
                  onClick={() => scrollToPage(idx)}
                  className={`group relative cursor-pointer rounded-lg border p-2 transition-all ${
                    isActive 
                      ? "border-teal-500 bg-teal-50/30 shadow-xs ring-1 ring-teal-500/30" 
                      : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      isActive ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {p.page}
                    </span>

                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDuplicatePage(idx); }}
                        className="p-0.5 text-slate-400 hover:text-teal-600 rounded"
                        title="Duplicate"
                      >
                        <Copy className="w-2.5 h-2.5" />
                      </button>
                      {pagesState.length > 1 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeletePage(idx); }}
                          className="p-0.5 text-slate-400 hover:text-red-500 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Compact Mini Preview Card */}
                  <div className="w-full aspect-[1/1.414] bg-white border border-slate-200 rounded overflow-hidden shadow-2xs relative">
                    {fileUrl ? (
                      <iframe 
                        src={`${fileUrl}#page=${p.page}&toolbar=0&navpanes=0&view=FitH`} 
                        className="w-full h-full border-0 pointer-events-none scale-100"
                        title={`Thumbnail Page ${p.page}`}
                      />
                    ) : (
                      <div className="p-1.5 text-[5px] text-slate-400 leading-tight font-serif select-none">
                        {p.text ? p.text.substring(0, 120) : <span className="italic text-slate-300">Empty Page</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50/50">
            <button 
              onClick={() => handleAddPage()}
              className="w-full py-1.5 bg-white border border-slate-200 hover:border-teal-500 text-teal-700 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3" />
              <span>Add Page</span>
            </button>
          </div>
        </div>

        {/* ── CENTER: Clean Minimalist A4 Viewer Canvas ─────────────────── */}
        <div className="flex-1 overflow-y-auto bg-slate-200/60 py-8 px-4 flex flex-col items-center gap-8 relative scroll-smooth">
          
          <div 
            ref={previewRef} 
            className="flex flex-col gap-8 items-center transition-transform duration-200 origin-top"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          >
            {pagesState.map((p, pageIdx) => (
              <div 
                key={pageIdx}
                ref={(el) => { pageRefs.current[pageIdx] = el; }}
                className="relative flex flex-col items-center group/page"
                style={{ pageBreakAfter: "always" }}
              >
                {/* Floating Page Label */}
                <div className="w-[210mm] flex items-center justify-between mb-2 px-1">
                  <div className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200/80 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <span className="text-[11px] font-bold text-slate-600">Page {p.page} of {pagesState.length}</span>
                  </div>

                  <div className="opacity-0 group-hover/page:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 backdrop-blur-xs p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
                    <button 
                      onClick={() => handleDuplicatePage(pageIdx)}
                      className="text-[10px] font-semibold text-slate-600 hover:text-teal-600 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </button>
                    {pagesState.length > 1 && (
                      <button 
                        onClick={() => handleDeletePage(pageIdx)}
                        className="text-[10px] font-semibold text-slate-600 hover:text-red-600 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                {/* Clean Pristine A4 Sheet Container (210mm x 297mm) */}
                <div 
                  className="relative shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-xs overflow-hidden bg-white"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    boxSizing: "border-box"
                  }}
                >
                  
                  {/* Base Vector PDF Image/Render */}
                  {fileUrl && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                      <iframe 
                        src={`${fileUrl}#page=${p.page}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="w-[101%] h-[101%] -mt-[0.5%] -ml-[0.5%] border-0 pointer-events-none shadow-none bg-white absolute inset-0"
                        title={`PDF Page Base ${p.page}`}
                      />
                    </div>
                  )}

                  {/* Interactive Bounding Box Editable Spans Layer */}
                  {p.spans && p.spans.length > 0 && (
                    <div className="absolute inset-0 z-30 pointer-events-auto">
                      {p.spans.map((span) => (
                        <EditableSpanBox
                          key={span.id}
                          span={span}
                          onSpanChange={(newText) => handleSpanChange(pageIdx, span.id, newText)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Live Watermark Layer */}
                  {watermarkEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-40 overflow-hidden">
                      {watermarkType === "text" && watermarkText && (
                        <span 
                          style={{
                            transform: `rotate(${watermarkAngle}deg)`,
                            opacity: watermarkOpacity,
                            color: watermarkColor,
                            fontSize: `${watermarkFontSize}px`,
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "4px",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {watermarkText}
                        </span>
                      )}

                      {watermarkType === "image" && watermarkImage && (
                        <img 
                          src={watermarkImage} 
                          alt="Watermark" 
                          style={{
                            transform: `rotate(${watermarkAngle}deg)`,
                            opacity: watermarkOpacity,
                            maxHeight: "50%",
                            maxWidth: "50%",
                            objectFit: "contain"
                          }}
                        />
                      )}
                    </div>
                  )}

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* ── RIGHT SIDEBAR: Document Settings Panel (w-[310px]) ─────────── */}
        <div className="w-[310px] shrink-0 bg-white border-l border-slate-200/80 flex flex-col shadow-2xs z-20 overflow-y-auto">
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-teal-600" />
            <h2 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Document Settings</h2>
          </div>

          <div className="p-4 space-y-5">
              
            {/* 1. Watermark Settings Section */}
            <div className="space-y-3 bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Stamp className="w-3.5 h-3.5 text-teal-600"/> Watermark
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={watermarkEnabled} 
                    onChange={(e) => setWatermarkEnabled(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {watermarkEnabled && (
                <div className="space-y-3 pt-2 border-t border-slate-200/60">
                  
                  {/* Type Selector: Text vs Image */}
                  <div className="grid grid-cols-2 gap-1 bg-white p-0.5 border border-slate-200 rounded-md text-xs font-semibold">
                    <button 
                      onClick={() => setWatermarkType("text")}
                      className={`py-1 rounded text-center transition-colors ${watermarkType === "text" ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      Text
                    </button>
                    <button 
                      onClick={() => watermarkInputRef.current?.click()}
                      className={`py-1 rounded text-center transition-colors ${watermarkType === "image" ? "bg-teal-50 text-teal-700 font-bold" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      Image Logo
                    </button>
                  </div>
                  <input 
                    ref={watermarkInputRef} 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleWatermarkImageUpload} 
                  />

                  {watermarkType === "text" ? (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-medium text-slate-600">Watermark Text</label>
                        <input 
                          type="text" 
                          value={watermarkText} 
                          onChange={(e) => setWatermarkText(e.target.value)} 
                          placeholder="e.g. CONFIDENTIAL" 
                          className="text-xs p-1.5 border border-slate-200 rounded-md focus:outline-none focus:border-teal-500 bg-white font-semibold uppercase" 
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-1 flex-1">
                          <label className="text-[11px] font-medium text-slate-600">Color</label>
                          <input 
                            type="color" 
                            value={watermarkColor} 
                            onChange={(e) => setWatermarkColor(e.target.value)} 
                            className="w-full h-7 rounded border border-slate-300 cursor-pointer bg-white" 
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <label className="text-[11px] font-medium text-slate-600">Size ({watermarkFontSize}px)</label>
                          <input 
                            type="range" 
                            min="24" max="96" step="2" 
                            value={watermarkFontSize} 
                            onChange={(e) => setWatermarkFontSize(Number(e.target.value))} 
                            className="accent-teal-600 cursor-pointer mt-1" 
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-medium text-slate-600">Selected Watermark Image</label>
                      <button 
                        onClick={() => watermarkInputRef.current?.click()}
                        className="text-xs p-2 border border-dashed border-teal-300 rounded-md bg-teal-50/50 text-teal-700 font-bold hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Change Image Logo</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex justify-between">
                        <label className="text-[11px] font-medium text-slate-600">Opacity</label>
                        <span className="text-[10px] font-bold text-slate-500">{Math.round(watermarkOpacity * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.05" max="0.6" step="0.05" 
                        value={watermarkOpacity} 
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))} 
                        className="accent-teal-600 cursor-pointer" 
                      />
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex justify-between">
                        <label className="text-[11px] font-medium text-slate-600">Angle</label>
                        <span className="text-[10px] font-bold text-slate-500">{watermarkAngle}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="-90" max="90" step="15" 
                        value={watermarkAngle} 
                        onChange={(e) => setWatermarkAngle(Number(e.target.value))} 
                        className="accent-teal-600 cursor-pointer" 
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document Actions</h3>
              <button 
                onClick={() => handleAddPage()}
                className="w-full py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-1.5 border border-teal-200/80"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Blank Page</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
