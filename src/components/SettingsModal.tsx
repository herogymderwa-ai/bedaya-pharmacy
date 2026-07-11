/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Save, Plus, Trash2, RotateCcw, ShieldAlert, Sliders, FileText, Check } from "lucide-react";
import { ActiveSelectionOptions, PharmacyInfo, PrintSettings } from "../types";
import { DEFAULT_PHARMACY_INFO, DEFAULT_PRINT_SETTINGS, INITIAL_OPTIONS } from "../constants";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pharmacyInfo: PharmacyInfo;
  onPharmacyInfoChange: (info: PharmacyInfo) => void;
  printSettings: PrintSettings;
  onPrintSettingsChange: (settings: PrintSettings) => void;
  options: ActiveSelectionOptions;
  onOptionsChange: (options: ActiveSelectionOptions) => void;
}

type SettingsTab = "pharmacy" | "presets" | "printing";

export default function SettingsModal({
  isOpen,
  onClose,
  pharmacyInfo,
  onPharmacyInfoChange,
  printSettings,
  onPrintSettingsChange,
  options,
  onOptionsChange,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("pharmacy");
  
  // Local states for editing to prevent partial saves
  const [localPharmacy, setLocalPharmacy] = useState<PharmacyInfo>({ ...pharmacyInfo });
  const [localPrint, setLocalPrint] = useState<PrintSettings>({ ...printSettings });
  const [localOptions, setLocalOptions] = useState<ActiveSelectionOptions>({
    quantities: [...options.quantities],
    timesPerDay: [...options.timesPerDay],
    timings: [...options.timings],
    relativeToFood: [...options.relativeToFood],
    durations: [...options.durations],
    additionalInstructions: [...options.additionalInstructions],
  });

  // Manage presets editing tab category
  const [activePresetCategory, setActivePresetCategory] = useState<keyof ActiveSelectionOptions>("quantities");
  const [newOptionValue, setNewOptionValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  if (!isOpen) return null;

  const handleSaveAll = () => {
    onPharmacyInfoChange(localPharmacy);
    onPrintSettingsChange(localPrint);
    onOptionsChange(localOptions);
    onClose();
  };

  const handleResetToDefaults = () => {
    if (confirm("هل أنت متأكد من رغبتك في إعادة ضبط جميع الخيارات والإعدادات إلى القيم الافتراضية؟")) {
      setLocalPharmacy({ ...DEFAULT_PHARMACY_INFO });
      setLocalPrint({ ...DEFAULT_PRINT_SETTINGS });
      setLocalOptions({
        quantities: [...INITIAL_OPTIONS.quantities],
        timesPerDay: [...INITIAL_OPTIONS.timesPerDay],
        timings: [...INITIAL_OPTIONS.timings],
        relativeToFood: [...INITIAL_OPTIONS.relativeToFood],
        durations: [...INITIAL_OPTIONS.durations],
        additionalInstructions: [...INITIAL_OPTIONS.additionalInstructions],
      });
      alert("تمت إعادة تعيين الإعدادات بنجاح. يرجى الضغط على حفظ لتأكيد التغييرات.");
    }
  };

  // Preset CRUD Operations
  const handleAddOption = () => {
    if (!newOptionValue.trim()) return;
    setLocalOptions({
      ...localOptions,
      [activePresetCategory]: [...localOptions[activePresetCategory], newOptionValue.trim()],
    });
    setNewOptionValue("");
  };

  const handleDeleteOption = (index: number) => {
    const list = [...localOptions[activePresetCategory]];
    list.splice(index, 1);
    setLocalOptions({
      ...localOptions,
      [activePresetCategory]: list,
    });
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleStartEdit = (index: number, val: string) => {
    setEditingIndex(index);
    setEditingValue(val);
  };

  const handleSaveEdit = (index: number) => {
    if (!editingValue.trim()) return;
    const list = [...localOptions[activePresetCategory]];
    list[index] = editingValue.trim();
    setLocalOptions({
      ...localOptions,
      [activePresetCategory]: list,
    });
    setEditingIndex(null);
  };

  const categoryLabels: Record<keyof ActiveSelectionOptions, string> = {
    quantities: "الكمية والجرعة",
    timesPerDay: "عدد المرات / الفترات",
    timings: "التوقيت اليومي",
    relativeToFood: "بالنسبة للطعام",
    durations: "المدة",
    additionalInstructions: "تعليمات إضافية",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center no-print">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
      ></div>

      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-xl mx-4 shadow-xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sliders size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">إعدادات تطبيق Dose Label</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">تحكم بالخيارات، الطابعة، ومعلومات الصيدلية الثابتة</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-3 pt-1">
          <button
            onClick={() => setActiveTab("pharmacy")}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "pharmacy"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            بيانات الصيدلية
          </button>
          <button
            onClick={() => setActiveTab("presets")}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "presets"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            تعديل خيارات الجرعات
          </button>
          <button
            onClick={() => setActiveTab("printing")}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === "printing"
                ? "border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            إعدادات الطباعة
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: PHARMACY INFO */}
          {activeTab === "pharmacy" && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-lg border border-emerald-500/10 text-emerald-800 dark:text-emerald-400 text-[11px] leading-relaxed font-semibold">
                تظهر هذه المعلومات بشكل دائم وتلقائي في أسفل ملصقات جرعات الأدوية الحرارية لتسهيل تواصل المريض مع صيدليتكم.
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">اسم الصيدلية الثابت:</label>
                  <input
                    type="text"
                    value={localPharmacy.name}
                    onChange={(e) => setLocalPharmacy({ ...localPharmacy, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white font-bold"
                    placeholder="مثال: صيدلية بداية المتميزة"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">رقم الهاتف للتواصل:</label>
                  <input
                    type="text"
                    value={localPharmacy.phone}
                    onChange={(e) => setLocalPharmacy({ ...localPharmacy, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white font-mono"
                    placeholder="مثال: 0550209025"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRESETS / OPTIONS */}
          {activeTab === "presets" && (
            <div className="space-y-3">
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
                {(Object.keys(categoryLabels) as Array<keyof ActiveSelectionOptions>).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActivePresetCategory(cat);
                      setEditingIndex(null);
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      activePresetCategory === cat
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>

              {/* Add New Option input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
                  placeholder={`إضافة خيار جديد في ${categoryLabels[activePresetCategory]}...`}
                  className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white font-medium"
                />
                <button
                  onClick={handleAddOption}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={12} />
                  <span>إضافة</span>
                </button>
              </div>

              {/* Editable Option List */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg max-h-[190px] overflow-y-auto bg-slate-50/50 dark:bg-slate-900/20 divide-y divide-slate-100 dark:divide-slate-800">
                {localOptions[activePresetCategory].length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-[11px]">لا يوجد خيارات مضافة حاليًا.</div>
                ) : (
                  localOptions[activePresetCategory].map((opt, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between gap-3 group">
                      <div className="flex-1">
                        {editingIndex === idx ? (
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={() => handleSaveEdit(idx)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(idx)}
                            autoFocus
                            className="w-full px-2 py-0.5 border border-emerald-500 rounded text-xs dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden"
                          />
                        ) : (
                          <span 
                            onClick={() => handleStartEdit(idx, opt)}
                            className="text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-600 hover:underline"
                            title="اضغط للتعديل السريع"
                          >
                            {opt}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingIndex === idx ? (
                          <button
                            onClick={() => handleSaveEdit(idx)}
                            className="text-emerald-600 hover:text-emerald-700 p-1 rounded cursor-pointer"
                          >
                            <Check size={12} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(idx, opt)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded cursor-pointer"
                          >
                            <FileText size={12} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteOption(idx)}
                          className="text-red-400 hover:text-red-600 p-1 rounded cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PRINT SETTINGS */}
          {activeTab === "printing" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">حجم الخط الافتراضي (بكسل):</label>
                  <input
                    type="number"
                    min="8"
                    max="24"
                    value={localPrint.baseFontSize}
                    onChange={(e) => setLocalPrint({ ...localPrint, baseFontSize: parseInt(e.target.value) || 12 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">عرض الملصق (مم):</label>
                  <input
                    type="number"
                    disabled
                    value={localPrint.printerWidth}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-400 font-mono font-bold"
                    title="الارتفاع الافتراضي ثابت لتجنب مشاكل الهدر والقص الحراري"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">ارتفاع الملصق (مم):</label>
                  <input
                    type="number"
                    disabled
                    value={localPrint.printerHeight}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-400 font-mono font-bold"
                    title="الارتفاع الافتراضي ثابت لتجنب مشاكل الهدر والقص الحراري"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">هوامش القص الإضافية (مم):</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.5"
                    value={localPrint.spacingMargin}
                    onChange={(e) => setLocalPrint({ ...localPrint, spacingMargin: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localPrint.autoSize}
                    onChange={(e) => setLocalPrint({ ...localPrint, autoSize: e.target.checked })}
                    className="rounded-sm border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">تصغير وتكبير الخط تلقائيًا (موصى به)</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">يقوم بتقليص حجم الخط عند إضافة نصوص طويلة لتجنب خروج الكلمات من حدود الملصق الحراري</span>
                  </div>
                </label>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-4">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-2 py-1.5 rounded-lg transition-all cursor-pointer border border-transparent hover:border-red-200"
            title="إرجاع الخيارات والقيم الافتراضية الأصلية"
          >
            <RotateCcw size={12} />
            <span>إعادة ضبط المصنع</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save size={12} />
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
