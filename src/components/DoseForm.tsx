/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Trash2, AlertCircle, Sparkles, Plus, Clock, Info, Check } from "lucide-react";
import { DoseData, ActiveSelectionOptions } from "../types";

interface DoseFormProps {
  options: ActiveSelectionOptions;
  doseData: DoseData;
  onChange: (newData: DoseData) => void;
  onReset: () => void;
}

export default function DoseForm({
  options,
  doseData,
  onChange,
  onReset,
}: DoseFormProps) {
  // Local states for custom manual inputs
  const [showCustomQty, setShowCustomQty] = useState(false);
  const [customQtyValue, setCustomQtyValue] = useState("");

  const [showCustomTiming, setShowCustomTiming] = useState(false);
  const [customTimingValue, setCustomTimingValue] = useState("");

  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDurationValue, setCustomDurationValue] = useState("");

  const [showCustomAdditional, setShowCustomAdditional] = useState(false);
  const [customAdditionalValue, setCustomAdditionalValue] = useState("");

  // Sync custom input states when doseData changes (e.g., when loaded from history/favorites)
  useEffect(() => {
    // Check Quantity
    if (doseData.quantity && !options.quantities.includes(doseData.quantity)) {
      setShowCustomQty(true);
      setCustomQtyValue(doseData.quantity);
    } else {
      setShowCustomQty(false);
    }

    // Check Timing
    if (doseData.timing && !options.timings.includes(doseData.timing)) {
      setShowCustomTiming(true);
      setCustomTimingValue(doseData.timing);
    } else {
      setShowCustomTiming(false);
    }

    // Check Duration
    if (doseData.duration && !options.durations.includes(doseData.duration)) {
      setShowCustomDuration(true);
      setCustomDurationValue(doseData.duration);
    } else {
      setShowCustomDuration(false);
    }
  }, [doseData, options]);

  // Trigger automatic text compiler whenever any dose state changes
  useEffect(() => {
    compileDoseText();
  }, [
    doseData.quantity,
    doseData.timesPerDay,
    doseData.timing,
    doseData.relativeToFood,
    doseData.duration,
    doseData.additional,
  ]);

  const compileDoseText = () => {
    const parts: string[] = [];

    if (doseData.quantity) {
      parts.push(doseData.quantity);
    }
    if (doseData.timesPerDay) {
      parts.push(doseData.timesPerDay);
    }
    if (doseData.timing) {
      parts.push(doseData.timing);
    }
    if (doseData.relativeToFood && doseData.relativeToFood !== "بدون تحديد") {
      parts.push(doseData.relativeToFood);
    }
    if (doseData.duration) {
      // Add "لمدة" (for duration) if not already included in duration text
      const durationText = doseData.duration.includes("لمدة") 
        ? doseData.duration 
        : `لمدة ${doseData.duration}`;
      parts.push(durationText);
    }

    // Join with dash
    let result = parts.join(" – ");

    // Append additional instructions if present
    if (doseData.additional.length > 0) {
      result += `\n(${doseData.additional.join("، ")})`;
    }

    onChange({
      ...doseData,
      customText: result,
    });
  };

  const handleSelectField = (field: keyof Omit<DoseData, "additional" | "customText">, value: string) => {
    // Reset custom toggles depending on chosen pre-set options
    if (field === "quantity") {
      setShowCustomQty(false);
    } else if (field === "timing") {
      setShowCustomTiming(false);
    } else if (field === "duration") {
      setShowCustomDuration(false);
    }

    onChange({
      ...doseData,
      [field]: value,
    });
  };

  const handleCustomQtySave = () => {
    if (customQtyValue.trim()) {
      onChange({
        ...doseData,
        quantity: customQtyValue.trim(),
      });
    }
  };

  const handleCustomTimingSave = () => {
    if (customTimingValue.trim()) {
      onChange({
        ...doseData,
        timing: customTimingValue.trim(),
      });
    }
  };

  const handleCustomDurationSave = () => {
    if (customDurationValue.trim()) {
      onChange({
        ...doseData,
        duration: customDurationValue.trim(),
      });
    }
  };

  // Toggle optional additional instructions
  const handleToggleAdditional = (item: string) => {
    const exists = doseData.additional.includes(item);
    let newList: string[];
    if (exists) {
      newList = doseData.additional.filter((i) => i !== item);
    } else {
      newList = [...doseData.additional, item];
    }
    onChange({
      ...doseData,
      additional: newList,
    });
  };

  const handleAddCustomAdditional = () => {
    if (customAdditionalValue.trim()) {
      const val = customAdditionalValue.trim();
      if (!doseData.additional.includes(val)) {
        onChange({
          ...doseData,
          additional: [...doseData.additional, val],
        });
      }
      setCustomAdditionalValue("");
      setShowCustomAdditional(false);
    }
  };

  return (
    <div className="space-y-4 no-print">
      
      {/* 1. QUANTITY SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">الخطوة 1</span>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">الكمية والجرعة</h3>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {options.quantities.map((qty) => (
            <button
              key={qty}
              type="button"
              onClick={() => handleSelectField("quantity", qty)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
                doseData.quantity === qty && !showCustomQty
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800/60"
              }`}
            >
              {qty}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setShowCustomQty(true);
              onChange({ ...doseData, quantity: "" });
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
              showCustomQty
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/30"
            }`}
          >
            جرعة أخرى +
          </button>
        </div>

        {/* Custom Quantity input box */}
        {showCustomQty && (
          <div className="mt-2.5 flex gap-2 animate-in slide-in-from-top-2 duration-150">
            <input
              type="text"
              value={customQtyValue}
              onChange={(e) => {
                setCustomQtyValue(e.target.value);
                onChange({ ...doseData, quantity: e.target.value });
              }}
              placeholder="اكتب الجرعة يدويًا (مثال: حبة ونصف، 15 مل...)"
              className="flex-1 px-3 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* 2. FREQUENCY SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">الخطوة 2</span>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">عدد المرات / الفترات</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {options.timesPerDay.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleSelectField("timesPerDay", time)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
                doseData.timesPerDay === time
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800/60"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DAILY TIMING */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">الخطوة 3</span>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">التوقيت اليومي</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {options.timings.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleSelectField("timing", t)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
                doseData.timing === t && !showCustomTiming
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800/60"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setShowCustomTiming(true);
              onChange({ ...doseData, timing: "" });
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
              showCustomTiming
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/30"
            }`}
          >
            توقيت مخصص +
          </button>
        </div>

        {/* Custom Timing Input */}
        {showCustomTiming && (
          <div className="mt-2.5 flex gap-2 animate-in slide-in-from-top-2 duration-150">
            <input
              type="text"
              value={customTimingValue}
              onChange={(e) => {
                setCustomTimingValue(e.target.value);
                onChange({ ...doseData, timing: e.target.value });
              }}
              placeholder="اكتب التوقيت يدويًا (مثال: بعد العصر، الظهر...)"
              className="flex-1 px-3 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* 4. MEAL RELATION */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">الخطوة 4</span>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">العلاقة بالطعام</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {options.relativeToFood.map((food) => (
            <button
              key={food}
              type="button"
              onClick={() => handleSelectField("relativeToFood", food)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
                doseData.relativeToFood === food
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800/60"
              }`}
            >
              {food}
            </button>
          ))}
        </div>
      </div>

      {/* 5. DURATION SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">الخطوة 5</span>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">المدة والزمن</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {options.durations.map((dur) => (
            <button
              key={dur}
              type="button"
              onClick={() => handleSelectField("duration", dur)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
                doseData.duration === dur && !showCustomDuration
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800/60"
              }`}
            >
              {dur}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setShowCustomDuration(true);
              onChange({ ...doseData, duration: "" });
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
              showCustomDuration
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/30"
            }`}
          >
            مدة مخصصة +
          </button>
        </div>

        {/* Custom Duration Input */}
        {showCustomDuration && (
          <div className="mt-2.5 flex gap-2 animate-in slide-in-from-top-2 duration-150">
            <input
              type="text"
              value={customDurationValue}
              onChange={(e) => {
                setCustomDurationValue(e.target.value);
                onChange({ ...doseData, duration: e.target.value });
              }}
              placeholder="اكتب المدة يدويًا (مثال: أسبوعين، 21 يوم...)"
              className="flex-1 px-3 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* 6. ADDITIONAL INSTRUCTIONS (OPTIONAL) */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">اختياري</span>
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">تعليمات إضافية</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {options.additionalInstructions.map((add) => {
            const isSelected = doseData.additional.includes(add);
            return (
              <button
                key={add}
                type="button"
                onClick={() => handleToggleAdditional(add)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800/60"
                }`}
              >
                {isSelected && <Check size={10} />}
                <span>{add}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setShowCustomAdditional(!showCustomAdditional)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-all duration-100 ${
              showCustomAdditional
                ? "bg-amber-500 text-white shadow-xs"
                : "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100/30"
            }`}
          >
            تعليمات مخصصة +
          </button>
        </div>

        {/* Custom Additional Instruction Input */}
        {showCustomAdditional && (
          <div className="mt-2.5 flex gap-2 animate-in slide-in-from-top-2 duration-150">
            <input
              type="text"
              value={customAdditionalValue}
              onChange={(e) => setCustomAdditionalValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustomAdditional()}
              placeholder="اكتب تعليمًا مخصصًا (مثال: تجنب القيادة بعد تناوله...)"
              className="flex-1 px-3 py-1 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-xs rounded-md focus:outline-hidden focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-white"
            />
            <button
              onClick={handleAddCustomAdditional}
              className="px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
            >
              إضافة
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs border border-slate-200 dark:border-slate-700"
        >
          <Trash2 size={13} />
          <span>مسح جميع الخيارات (F2)</span>
        </button>
      </div>

    </div>
  );
}
