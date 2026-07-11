/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Keyboard, HelpCircle } from "lucide-react";

export default function KeyboardShortcutsHelp() {
  const shortcuts = [
    { keys: ["F9", "Ctrl + Enter"], desc: "طباعة الملصق الحالي فورًا" },
    { keys: ["F4", "Alt + R"], desc: "إعادة طباعة آخر ملصق" },
    { keys: ["F2", "Alt + N"], desc: "مسح الحقول وبدء جرعة جديدة" },
    { keys: ["Alt + S"], desc: "حفظ الجرعة الحالية كجرعة مفضلة" },
    { keys: ["Alt + D"], desc: "تعديل نص الجرعة يدويًا" },
    { keys: ["Alt + O"], desc: "فتح نافذة الإعدادات" },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800/80 shadow-xs">
      <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
        <Keyboard size={14} className="text-emerald-600 dark:text-emerald-400" />
        <span>اختصارات لوحة المفاتيح الفائقة (لتسريع العمل)</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {shortcuts.map((sh, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-200 dark:border-slate-800/40">
            <span className="text-slate-600 dark:text-slate-400 font-bold">{sh.desc}</span>
            <div className="flex gap-1">
              {sh.keys.map((key, kIdx) => (
                <kbd 
                  key={kIdx} 
                  className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-md text-[9px] font-mono font-bold shadow-2xs flex items-center"
                >
                  {key}
                </kbd>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
        * تعمل هذه الاختصارات من أي مكان بالتطبيق مباشرة لتخفيف العبء عن يد الصيدلي
      </p>
    </div>
  );
}
