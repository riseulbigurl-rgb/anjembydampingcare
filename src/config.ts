import type { LucideIcon } from 'lucide-react';
import { Bike, Car } from 'lucide-react';

export type VehicleId = 'motor' | 'mobil';

export interface VehicleConfig {
  id: VehicleId;
  label: string;
  short: string;
  icon: LucideIcon;
  emoji: string;
  description: string;
  minimumDistance: number;
  minimumFare: number;
  additionalFarePerKm: number;
}

export interface RegionConfig {
  id: string;
  name: string;
  whatsapp: string;
}

export const FARE_CONFIG = {
  adminFee: 2000,
  motor: {
    minimumDistance: 3,
    minimumFare: 7000,
    additionalFarePerKm: 2500,
  label: 'Motor',
    emoji: '🛵',
  },
  mobil: {
    minimumDistance: 3,
    minimumFare: 20000,
    additionalFarePerKm: 5000,
    label: 'Mobil',
    emoji: '🚗',
  },
} as const;

export const REGIONS: RegionConfig[] = [
  { id: 'solo', name: 'Solo (Surakarta)', whatsapp: 'https://chat.whatsapp.com/DQviHP2VuQRAfeyLWgHfbH?s=cl&p=a&mlu=4' },
  { id: 'sukoharjo', name: 'Sukoharjo', whatsapp: 'https://chat.whatsapp.com/KpY6497rBmZJBBKmzoRj9q?s=cl&p=a&mlu=4' },
  { id: 'boyolali', name: 'Boyolali', whatsapp: 'https://chat.whatsapp.com/CC9HhDSZcPwCvV2KEDgI6P?s=cl&p=a&mlu=4' },
  { id: 'karanganyar', name: 'Karanganyar', whatsapp: 'https://chat.whatsapp.com/LuvUIfzqqatARnFyYwcEFm?s=sh&p=a&mlu=4' },
  { id: 'sragen', name: 'Sragen', whatsapp: 'https://chat.whatsapp.com/KVdFO8IeKwQ7N86m25Z6d1?s=cl&p=a&mlu=4' },
  { id: 'klaten', name: 'Klaten', whatsapp: 'https://chat.whatsapp.com/Iog3TRNdecdHIxmjh8LnKd?s=cl&p=a&mlu=4' },
  { id: 'yogyakarta', name: 'Yogyakarta', whatsapp: 'https://chat.whatsapp.com/JNbrP7sQwRpHTTBK1ixvZX?s=cl&p=a&mlu=4' },
];

export const VEHICLES: VehicleConfig[] = [
  {
    id: 'motor',
    label: 'Anjem Motor',
    short: 'Motor',
    icon: Bike,
    emoji: '🛵',
    description: 'Antar-jemput menggunakan motor.',
    minimumDistance: FARE_CONFIG.motor.minimumDistance,
    minimumFare: FARE_CONFIG.motor.minimumFare,
    additionalFarePerKm: FARE_CONFIG.motor.additionalFarePerKm,
  },
  {
    id: 'mobil',
    label: 'Anjem Mobil',
    short: 'Mobil',
    icon: Car,
    emoji: '🚗',
    description: 'Antar-jemput menggunakan mobil.',
    minimumDistance: FARE_CONFIG.mobil.minimumDistance,
    minimumFare: FARE_CONFIG.mobil.minimumFare,
    additionalFarePerKm: FARE_CONFIG.mobil.additionalFarePerKm,
  },
];
