/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Printer, 
  Settings, 
  Sun, 
  Moon, 
  Plus, 
  Trash2, 
  Clock as ClockIcon, 
  Star, 
  FileText, 
  Share2, 
  Laptop, 
  HelpCircle,
  Download
} from "lucide-react";
import { 
  DoseData, 
  FavoriteDose, 
  HistoryItem, 
  PharmacyInfo, 
  PrintSettings, 
  ActiveSelectionOptions 
} from "./types";
import { 
  DEFAULT_PHARMACY_INFO, 
  DEFAULT_PRINT_SETTINGS, 
  INITIAL_OPTIONS, 
  INITIAL_FAVORITES 
} from "./constants";

import LabelPreview from "./components/LabelPreview";
import DoseForm from "./components/DoseForm";
import SidebarHistoryAndFavorites from "./components/SidebarHistoryAndFavorites";
import SettingsModal from "./components/SettingsModal";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";

const initialDoseState: DoseData = {
  quantity: "",
  timesPerDay: "",
  timing: "",
  relativeToFood: "",
  duration: "",
  additional: [],
  customText: "",
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("dose_label_theme");
    return saved === "dark" ? "dark" : "light";
  });

  // Settings states
  const [pharmacyInfo, setPharmacyInfo] = useState<PharmacyInfo>(() => {
    const saved = localStorage.getItem("dose_label_pharmacy_info");
    return saved ? JSON.parse(saved) : DEFAULT_PHARMACY_INFO;
  });

  const [printSettings, setPrintSettings] = useState<PrintSettings>(() => {
    const saved = localStorage.getItem("dose_label_print_settings");
    return saved ? JSON.parse(saved) : DEFAULT_PRINT_SETTINGS;
  });

  const [options, setOptions] = useState<ActiveSelectionOptions>(() => {
    const saved = localStorage.getItem("dose_label_options");
    return saved ? JSON.parse(saved) : INITIAL_OPTIONS;
  });

  const [favorites, setFavorites] = useState<FavoriteDose[]>(() => {
    const saved = localStorage.getItem("dose_label_favorites");
    return saved ? JSON.parse(saved) : INITIAL_FAVORITES;
  });

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("dose_label_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Active builder states
  const [doseData, setDoseData] = useState<DoseData>({ ...initialDoseState });
  const [copies, setCopies] = useState<number>(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Digital clock
  const [currentTime, setCurrentTime] = useState("");

  // Print overrides for quick direct historical re-printing without changing editor state
  const [printOverrideText, setPrintOverrideText] = useState<string | null>(null);
  const [printOverrideCopies, setPrintOverrideCopies] = useState<number | null>(null);

  // PWA install prompt handler state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("dose_label_pharmacy_info", JSON.stringify(pharmacyInfo));
  }, [pharmacyInfo]);

  useEffect(() => {
    localStorage.setItem("dose_label_print_settings", JSON.stringify(printSettings));
  }, [printSettings]);

  useEffect(() => {
    localStorage.setItem("dose_label_options", JSON.stringify(options));
  }, [options]);

  useEffect(() => {
    localStorage.setItem("dose_label_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("dose_label_history", JSON.stringify(historyItems));
  }, [historyItems]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dose_label_theme", theme);
  }, [theme]);

  // Digital Pharmacy Clock Tick
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: true })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen to PWA installable triggers
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else {
      alert("التطبيق يعمل بالفعل كـ PWA! يمكنك تثبيته من إعدادات متصفحك مباشرة.");
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ALT Key Shortcuts
      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === "r" || key === "ق") {
          e.preventDefault();
          handleReprintLast();
        } else if (key === "n" || key === "ى") {
          e.preventDefault();
          handleResetForm();
        } else if (key === "s" || key === "س") {
          e.preventDefault();
          handleAddCurrentAsFavorite();
        } else if (key === "o" || key === "خ") {
          e.preventDefault();
          setIsSettingsOpen(true);
        } else if (key === "d" || key === "ي") {
          e.preventDefault();
          // Toggle manual edit trigger on preview
          const toggleBtn = document.querySelector('[title="تعديل النص يدويًا"]') as HTMLElement;
          if (toggleBtn) toggleBtn.click();
        }
      } else {
        // Direct Function Keys
        if (e.key === "F9") {
          e.preventDefault();
          handlePrint();
        } else if (e.key === "F4") {
          e.preventDefault();
          handleReprintLast();
        } else if (e.key === "F2") {
          e.preventDefault();
          handleResetForm();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [doseData, copies, historyItems, favorites, pharmacyInfo]);

  // Handle printing
  const handlePrint = () => {
    if (!doseData.customText.trim()) {
      alert("الرجاء تحديد جرعة دواء أولاً قبل الطباعة.");
      return;
    }

    // 1. Save item to print history
    const newItem: HistoryItem = {
      id: `history-${Date.now()}`,
      timestamp: Date.now(),
      text: doseData.customText,
      data: { ...doseData },
      copies: copies,
    };

    setHistoryItems((prev) => [newItem, ...prev]);

    // 2. Increment favorite usage counts if exactly matches a favorite
    setFavorites((prev) =>
      prev.map((fav) => {
        if (fav.data.customText.trim() === doseData.customText.trim()) {
          return { ...fav, usageCount: fav.usageCount + 1 };
        }
        return fav;
      })
    );

    // 3. Trigger printing window
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Reprint the last printed sticker
  const handleReprintLast = () => {
    if (historyItems.length === 0) {
      alert("سجل المطبوعات فارغ! يرجى طباعة ملصق واحد على الأقل أولاً.");
      return;
    }
    const lastItem = historyItems[0];
    
    // Set direct print overrides
    setPrintOverrideText(lastItem.text);
    setPrintOverrideCopies(lastItem.copies);

    // Prompt print
    setTimeout(() => {
      window.print();
      // Revert overrides immediately
      setPrintOverrideText(null);
      setPrintOverrideCopies(null);
    }, 100);
  };

  // Direct print from history sidebar
  const handleDirectPrintHistory = (text: string, histCopies: number) => {
    setPrintOverrideText(text);
    setPrintOverrideCopies(histCopies);

    setTimeout(() => {
      window.print();
      setPrintOverrideText(null);
      setPrintOverrideCopies(null);
    }, 100);
  };

  const handleResetForm = () => {
    setDoseData({ ...initialDoseState });
    setCopies(1);
  };

  // Add current active dose to quick favorites
  const handleAddCurrentAsFavorite = () => {
    if (!doseData.customText.trim()) {
      alert("يرجى تكوين تفاصيل جرعة دواء لحفظها في المفضلة.");
      return;
    }

    // Check if already in favorites
    const isDuplicate = favorites.some(
      (fav) => fav.data.customText.trim() === doseData.customText.trim()
    );

    if (isDuplicate) {
      alert("هذه الجرعة موجودة بالفعل في المفضلة.");
      return;
    }

    const newFavorite: FavoriteDose = {
      id: `fav-${Date.now()}`,
      label: doseData.customText.split("\n")[0] || doseData.customText, // Use the first line as label
      data: { ...doseData },
      usageCount: 1,
    };

    setFavorites((prev) => [newFavorite, ...prev]);
    alert("تم حفظ الجرعة في قائمة المفضلة بنجاح!");
  };

  const handleDeleteFavorite = (id: string) => {
    if (confirm("هل تريد حذف هذه الجرعة من المفضلة؟")) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    }
  };

  const handleClearHistory = () => {
    if (confirm("هل تريد مسح سجل الملصقات المطبوعة بالكامل؟")) {
      setHistoryItems([]);
    }
  };

  // Smart formula to calculate font size of printable element
  const getDynamicFontSize = (textStr: string) => {
    if (!printSettings.autoSize) return `${printSettings.baseFontSize}px`;
    const len = textStr.length;
    let size = printSettings.baseFontSize;
    
    if (len > 80) {
      size = Math.max(9, size - 4);
    } else if (len > 60) {
      size = Math.max(10, size - 3);
    } else if (len > 45) {
      size = Math.max(11, size - 2);
    } else if (len > 30) {
      size = Math.max(12, size - 1);
    } else if (len < 15) {
      size = Math.min(18, size + 2);
    }
    return `${size}px`;
  };

  // Printable variables definition
  const activePrintText = printOverrideText || doseData.customText;
  const activePrintCopies = printOverrideCopies || copies;

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. OFFSCREEN DYNAMIC PRINT CONTAINER (VISIBLE ONLY DURING MEDIA PRINT) */}
      <div className="hidden print-only" dir="rtl">
        {Array.from({ length: activePrintCopies }).map((_, index) => (
          <div 
            key={index} 
            className="print-page"
            style={{ 
              paddingTop: `${1.5 + printSettings.spacingMargin}mm`, 
              paddingBottom: `${1.5 + printSettings.spacingMargin}mm` 
            }}
          >
            {/* Dose dosage description centered */}
            <div className="flex flex-col flex-1 justify-center items-center text-center px-1">
              <p
                className="w-full text-center leading-relaxed font-bold text-black whitespace-pre-line"
                style={{ fontSize: getDynamicFontSize(activePrintText) }}
              >
                {activePrintText}
              </p>
            </div>

            {/* Standard Footer Stamp */}
            <div 
              className="border-t border-black pt-1 mt-1 flex justify-between items-center text-black font-extrabold select-none"
              style={{ fontSize: "8px" }}
            >
              <span>{pharmacyInfo.name}</span>
              <span style={{ fontFamily: "monospace", letterSpacing: "0.5px" }}>{pharmacyInfo.phone}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ON-SCREEN WORKSPACE (HIDDEN DURING MEDIA PRINT) */}
      <div className="no-print flex-1 flex flex-col">
        
        {/* Navigation & Header */}
        <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6 sticky top-0 z-30 shadow-xs transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            
            {/* Branding Logo & Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                <Printer size={18} className="stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                  <span>Dose Label</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-md font-bold">طباعة حرارية ذكية</span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">ملصقات جرعات الأدوية بدقة صيدلانية عالية</p>
              </div>
            </div>

            {/* Real-time details & actions toolbar */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              
              {/* Live Clock */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
                <ClockIcon size={12} />
                <span className="text-xs font-mono font-bold tracking-wider">{currentTime || "00:00 م"}</span>
              </div>

              {/* Installable PWA Indicator */}
              {isInstallable && (
                <button
                  onClick={handleInstallPWA}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="تثبيت التطبيق على جهازك للعمل بدون إنترنت وبسرعة فائقة"
                >
                  <Download size={12} />
                  <span>تثبيت التطبيق</span>
                </button>
              )}

              {/* Theme Toggle Button */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
              >
                {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
              </button>

              {/* Settings Trigger */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-lg border border-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="فتح إعدادات الخيارات والطباعة ومعلومات الصيدلية"
              >
                <Settings size={14} />
                <span>الإعدادات</span>
              </button>

            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Main Area: Builder & Live Preview (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Quick Hero Indicator / Intro */}
            <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 rounded-xl p-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-extrabold mb-0.5">لوحة توليد جرعات الأدوية الفورية</h2>
                <p className="text-[11px] text-emerald-100/90">حدد المعايير لتجهيز الملصق تلقائيًا، واضغط F9 للطباعة المباشرة بدون هوامش وبجودة عالية.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xs py-1.5 px-2.5 rounded-lg flex items-center gap-1.5 self-start sm:self-auto text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>جاهز للطباعة الحرارية</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              
              {/* Column 1: Dose Form selection (left/middle on desktop) */}
              <div className="order-2 md:order-1">
                <DoseForm
                  options={options}
                  doseData={doseData}
                  onChange={setDoseData}
                  onReset={handleResetForm}
                />
              </div>

              {/* Column 2: Live interactive Sticker Preview & printer controllers (sticky on desktop) */}
              <div className="order-1 md:order-2 md:sticky md:top-[74px] space-y-4">
                <LabelPreview
                  text={doseData.customText}
                  onTextChange={(newVal) => setDoseData({ ...doseData, customText: newVal })}
                  pharmacyInfo={pharmacyInfo}
                  printSettings={printSettings}
                  copies={copies}
                  onCopiesChange={setCopies}
                  onPrint={handlePrint}
                  onReprintLast={handleReprintLast}
                  hasHistory={historyItems.length > 0}
                />
                
                {/* Keyboard helper inside column to maximize visibility */}
                <KeyboardShortcutsHelp />
              </div>

            </div>

          </div>

          {/* Sidebar Area: Favorites & Print History (4 cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[74px] space-y-4">
            <SidebarHistoryAndFavorites
              favorites={favorites}
              onSelectFavorite={(favData) => {
                setDoseData({ ...favData });
                setCopies(1);
              }}
              onDeleteFavorite={handleDeleteFavorite}
              onAddCurrentAsFavorite={handleAddCurrentAsFavorite}
              historyItems={historyItems}
              onDirectPrintHistory={handleDirectPrintHistory}
              onLoadHistoryToEditor={(histData) => {
                setDoseData({ ...histData });
                setCopies(1);
              }}
              onClearHistory={handleClearHistory}
            />
          </div>

        </main>

        {/* Dynamic Footer credits */}
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-4 px-6 mt-8 transition-colors text-center text-[11px] text-slate-400 dark:text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Dose Label. جميع الحقوق محفوظة.</p>
            <p className="flex items-center gap-1.5 font-semibold text-slate-500">
              <span>تم التطوير خصيصًا لتبسيط أعمال الصيدلة السريعة</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>يعمل بدون اتصال بالإنترنت</span>
            </p>
          </div>
        </footer>

      </div>

      {/* Settings Dialog / Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pharmacyInfo={pharmacyInfo}
        onPharmacyInfoChange={setPharmacyInfo}
        printSettings={printSettings}
        onPrintSettingsChange={setPrintSettings}
        options={options}
        onOptionsChange={setOptions}
      />

    </div>
  );
}
