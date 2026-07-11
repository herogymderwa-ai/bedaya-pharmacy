/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DoseData {
  quantity: string;
  timesPerDay: string;
  timing: string;
  relativeToFood: string;
  duration: string;
  additional: string[];
  customText: string;
}

export interface FavoriteDose {
  id: string;
  label: string;
  data: DoseData;
  usageCount: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  text: string;
  data: DoseData;
  copies: number;
}

export interface PharmacyInfo {
  name: string;
  phone: string;
}

export interface PrintSettings {
  printerWidth: number; // in mm, e.g., 50
  printerHeight: number; // in mm, e.g., 23
  baseFontSize: number; // in pt or px, e.g., 12
  autoSize: boolean;
  printDirectly: boolean;
  spacingMargin: number; // in mm, e.g., 0
}

export interface ActiveSelectionOptions {
  quantities: string[];
  timesPerDay: string[];
  timings: string[];
  relativeToFood: string[];
  durations: string[];
  additionalInstructions: string[];
}
