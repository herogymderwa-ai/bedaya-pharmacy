/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Star, History, Trash2, ArrowUpRight, Search, Printer, RotateCcw, Flame } from "lucide-react";
import { FavoriteDose, HistoryItem, DoseData } from "../types";

interface SidebarHistoryAndFavoritesProps {
  favorites: FavoriteDose[];
  onSelectFavorite: (data: DoseData) => void;
  onDeleteFavorite: (id: string) => void;
  onAddCurrentAsFavorite: () => void;
  historyItems: HistoryItem[];
  onDirectPrintHistory: (text: string, copies: number) => void;
  onLoadHistoryToEditor: (data: DoseData) => void;
  onClearHistory: () => void;
}

export default function SidebarHistoryAndFavorites({
  favorites,
  onSelectFavorite,
  onDeleteFavorite,
  onAddCurrentAsFavorite,
  historyItems,
  onDirectPrintHistory,
  onLoadHistoryToEditor,
  onClearHistory,
}: SidebarHistoryAndFavoritesProps) {
  const [activeTab, setActiveTab] = useState<"favorites" | "history">("favorites");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = historyItems.filter((item) =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFavorites = favorites.filter((fav) =>
    fav.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format historical timestamp nicely
  const formatTime = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col h-[580px] overflow-hidden no-print">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <button
          onClick={() => { setActiveTab("favorites"); setSearchTerm(""); }}
          className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === "favorites"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          <Star size={13} className={activeTab === "favorites" ? "fill-emerald-500 text-emerald-500" : ""} />
          <span>الجرعات المفضلة ({favorites.length})</span>
        </button>
        <button
          onClick={() => { setActiveTab("history"); setSearchTerm(""); }}
          className={`flex-1 py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border-b-2 ${
            activeTab === "history"
              ? "border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700"
          }`}
        >
          <History size={13} />
          <span>سجل الملصقات ({historyItems.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === "favorites" ? "ابحث عن جرعة مفضلة..." : "ابحث في السجل..."}
            className="w-full pl-2.5 pr-7 py-1.5 bg-slate-50 dark:bg-slate-800 text-[11px] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white font-medium"
          />
        </div>
        {activeTab === "favorites" ? (
          <button
            onClick={onAddCurrentAsFavorite}
            className="px-2 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/20 rounded-lg text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-100 dark:hover:bg-emerald-950/80 transition-colors cursor-pointer whitespace-nowrap"
            title="حفظ الجرعة الحالية التي تظهر في المعاينة كجرعة سريعة ومفضلة"
          >
            <Star size={11} className="fill-current" />
            <span>حفظ الحالية</span>
          </button>
        ) : (
          historyItems.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
              title="مسح سجل الطباعة بالكامل"
            >
              <Trash2 size={12} />
            </button>
          )
        )}
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/20 dark:bg-slate-900/10">
        
        {/* FAVORITES VIEW */}
        {activeTab === "favorites" && (
          <>
            {filteredFavorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <Star size={20} className="mb-2 stroke-1" />
                <p className="text-xs">لم يتم العثور على أي جرعات مفضلة</p>
                <p className="text-[10px] mt-1 text-slate-400">اضغط على زر "حفظ الحالية" لإضافة جرعتك الحالية إلى المفضلة</p>
              </div>
            ) : (
              // Sort favorites by usageCount descending
              [...filteredFavorites]
                .sort((a, b) => b.usageCount - a.usageCount)
                .map((fav) => (
                  <div
                    key={fav.id}
                    className="group bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-150 relative flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p 
                        onClick={() => onSelectFavorite(fav.data)}
                        className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 leading-relaxed flex-1 select-none"
                      >
                        {fav.label}
                      </p>
                      <button
                        onClick={() => onDeleteFavorite(fav.id)}
                        className="text-slate-300 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                        title="حذف من المفضلة"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5 px-2 py-0.5 rounded-full">
                        <Flame size={9} className="fill-current" />
                        <span>استخدمت {fav.usageCount} مرات</span>
                      </span>
                      <button
                        onClick={() => onSelectFavorite(fav.data)}
                        className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        <span>اختيار</span>
                        <ArrowUpRight size={9} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </>
        )}

        {/* HISTORY VIEW */}
        {activeTab === "history" && (
          <>
            {filteredHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <History size={20} className="mb-2 stroke-1" />
                <p className="text-xs">سجل المطبوعات فارغ حاليًا</p>
                <p className="text-[10px] mt-1 text-slate-400">ابدأ بطباعة الملصقات لتظهر تفاصيلها وسجلها هنا تلقائيًا</p>
              </div>
            ) : (
              // Sort history by timestamp descending
              [...filteredHistory]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col justify-between"
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                      {item.text}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
                      <span className="font-mono">
                        {formatTime(item.timestamp)} • {item.copies} {item.copies > 1 ? "نسخ" : "نسخة"}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onLoadHistoryToEditor(item.data)}
                          className="flex items-center gap-0.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold cursor-pointer"
                          title="تحميل تفاصيل هذه الجرعة وتعديلها مجددًا"
                        >
                          <RotateCcw size={9} />
                          <span>تعديل</span>
                        </button>
                        <button
                          onClick={() => onDirectPrintHistory(item.text, item.copies)}
                          className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                          title="إعادة طباعة هذا الملصق فورًا بنفس عدد النسخ"
                        >
                          <Printer size={9} />
                          <span>طباعة فورية</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </>
        )}

      </div>
    </div>
  );
}
