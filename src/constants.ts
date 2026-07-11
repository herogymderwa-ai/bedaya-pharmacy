/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActiveSelectionOptions, PharmacyInfo, PrintSettings, FavoriteDose } from "./types";

export const DEFAULT_PHARMACY_INFO: PharmacyInfo = {
  name: "صيدلية بداية المتميزة",
  phone: "0550209025",
};

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  printerWidth: 50,
  printerHeight: 23,
  baseFontSize: 13,
  autoSize: true,
  printDirectly: false,
  spacingMargin: 0,
};

export const INITIAL_OPTIONS: ActiveSelectionOptions = {
  quantities: [
    "حبة",
    "نصف حبة",
    "حبتان",
    "2.5 مل",
    "5 مل",
    "7.5 مل",
    "10 مل",
    "بخة",
    "نقطة",
    "نقاط",
    "ملعقة"
  ],
  timesPerDay: [
    "مرة واحدة يوميًا",
    "مرتين يوميًا",
    "3 مرات يوميًا",
    "4 مرات يوميًا",
    "5 مرات يوميًا",
    "6 مرات يوميًا",
    "كل 4 ساعات",
    "كل 6 ساعات",
    "كل 8 ساعات",
    "كل 12 ساعة",
    "عند اللزوم"
  ],
  timings: [
    "صباحًا",
    "مساءً",
    "صباحًا ومساءً",
    "قبل النوم"
  ],
  relativeToFood: [
    "قبل الأكل",
    "بعد الأكل",
    "مع الأكل",
    "على معدة فارغة",
    "بدون تحديد"
  ],
  durations: [
    "3 أيام",
    "5 أيام",
    "7 أيام",
    "10 أيام",
    "14 يومًا",
    "شهر"
  ],
  additionalInstructions: [
    "رج العبوة جيدًا قبل الاستخدام",
    "يحفظ في الثلاجة",
    "للاستعمال الخارجي فقط",
    "أكمل مدة العلاج"
  ]
};

export const INITIAL_FAVORITES: FavoriteDose[] = [
  {
    id: "fav-1",
    label: "حبة – مرتين يوميًا – بعد الأكل – لمدة 5 أيام",
    usageCount: 12,
    data: {
      quantity: "حبة",
      timesPerDay: "مرتين يوميًا",
      timing: "",
      relativeToFood: "بعد الأكل",
      duration: "5 أيام",
      additional: [],
      customText: "حبة – مرتين يوميًا – بعد الأكل – لمدة 5 أيام"
    }
  },
  {
    id: "fav-2",
    label: "5 مل – 3 مرات يوميًا – بعد الأكل – لمدة 7 أيام",
    usageCount: 8,
    data: {
      quantity: "5 مل",
      timesPerDay: "3 مرات يوميًا",
      timing: "",
      relativeToFood: "بعد الأكل",
      duration: "7 أيام",
      additional: [],
      customText: "5 مل – 3 مرات يوميًا – بعد الأكل – لمدة 7 أيام"
    }
  },
  {
    id: "fav-3",
    label: "حبة – عند اللزوم – قبل النوم",
    usageCount: 5,
    data: {
      quantity: "حبة",
      timesPerDay: "عند اللزوم",
      timing: "قبل النوم",
      relativeToFood: "بدون تحديد",
      duration: "",
      additional: [],
      customText: "حبة – عند اللزوم – قبل النوم"
    }
  }
];
