/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { Printer, Edit3, Check, RefreshCw } from "lucide-react";
import { PharmacyInfo, PrintSettings } from "../types";

interface LabelPreviewProps {
  text: string;
  onTextChange: (newText: string) => void;
  pharmacyInfo: PharmacyInfo;
  printSettings: PrintSettings;
  copies: number;
  onCopiesChange: (copies: number) => void;
  onPrint: () => void;
  onReprintLast: (() => void) | null;
  hasHistory: boolean;
}

export default function LabelPreview({
  text,
  onTextChange,
  pharmacyInfo,
  printSettings,
  copies,
  onCopiesChange,
  onPrint,
  onReprintLast,
  hasHistory,
}: LabelPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-calculate font size based on text length and print settings
  const getDynamicFontSize = (str: string) => {
    if (!printSettings.autoSize) return `${printSettings.baseFontSize}px`;
    const len = str.length;
    let size = printSettings.baseFontSize; // default around 13-14px
    
    if (len > 80) {
      size = Math.max(9, size - 4);
    } else if (len > 60) {
      size = Math.max(10, size - 3);
    } else if (len > 45) {
      size = Math.max(11, size - 2);
    } else if (len > 30) {
      size = Math.max(12, size - 1);
    } else if (len < 15) {
      size = Math.min(18, size + 2); // Make short labels larger
    }
    return `${size}px`;
  };

  const dynamicFontSize = getDynamicFontSize(text);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  return (
    <div id="label-preview-section" className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 pulsing-ring"></span>
          <span>معاينة الملصق (50mm × 23mm)</span>
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
            isEditing
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200"
          }`}
          title="تعديل النص يدويًا"
        >
          {isEditing ? (
            <>
              <Check size={12} />
              <span>حفظ التعديل</span>
            </>
          ) : (
            <>
              <Edit3 size={12} />
              <span>تعديل يدوي</span>
            </>
          )}
        </button>
      </div>

      {/* Realistic 50mm x 23mm Sticker (aspect ratio: 50 / 23 ~ 2.17) */}
      {/* We scale it up on screen for crisp editing (e.g., width 380px, height 175px) */}
      <div className="relative group">
        <div 
          className="w-[380px] h-[175px] bg-white text-black border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm p-3 flex flex-col justify-between select-text transition-all duration-300 ease-in-out relative overflow-hidden"
          dir="rtl"
        >
          {/* Subtle thermal line indicator on the sides */}
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-slate-100"></div>
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-slate-100"></div>

          {/* Sticker Content */}
          <div className="flex flex-col flex-1 justify-center items-center text-center px-1">
            {isEditing ? (
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                onBlur={() => setIsEditing(false)}
                className="w-full h-full text-center resize-none bg-emerald-50/75 text-slate-900 border border-emerald-200 rounded p-1 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-bold leading-relaxed"
                style={{ fontSize: dynamicFontSize }}
                dir="rtl"
                placeholder="اكتب تفاصيل الجرعة هنا..."
              />
            ) : (
              <p
                onClick={() => setIsEditing(true)}
                className="w-full text-center leading-relaxed font-bold text-slate-950 whitespace-pre-line cursor-text hover:bg-slate-50 transition-colors py-1 rounded"
                style={{ fontSize: dynamicFontSize }}
              >
                {text || "يرجى تحديد تفاصيل الجرعة من الخيارات الجانبية..."}
              </p>
            )}
          </div>

          {/* Pharmacy Stamp / Footer (Fixed and styled beautifully) */}
          <div className="border-t border-slate-300 pt-1 mt-1 flex justify-between items-center text-[10px] font-semibold text-slate-800 select-none">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
              {pharmacyInfo.name}
            </span>
            <span className="font-mono tracking-wider">{pharmacyInfo.phone}</span>
          </div>
        </div>

        {/* Real Dimensions Help tag */}
        <div className="text-center mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
          الحجم الحقيقي عند الطباعة: 5سم × 2.3سم
        </div>
      </div>

      {/* Printing Controls */}
      <div className="w-full mt-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <span>عدد النسخ:</span>
          </label>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => onCopiesChange(Math.max(1, copies - 1))}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="99"
              value={copies}
              onChange={(e) => onCopiesChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-10 text-center bg-transparent border-0 font-bold text-slate-800 dark:text-white text-xs focus:ring-0 focus:outline-hidden"
            />
            <button
              type="button"
              onClick={() => onCopiesChange(copies + 1)}
              className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={onPrint}
            disabled={!text}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-98 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            <Printer size={14} />
            <span>طباعة الملصق (F9)</span>
          </button>

          <button
            onClick={onReprintLast || undefined}
            disabled={!onReprintLast || !hasHistory}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-98 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-xs border border-slate-200 dark:border-slate-700"
            title="إعادة طباعة آخر ملصق مباشرة بضغطة واحدة"
          >
            <RefreshCw size={12} />
            <span>إعادة طباعة الأخير (F4)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
