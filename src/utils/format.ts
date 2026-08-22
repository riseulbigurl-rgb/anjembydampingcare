import { FARE_CONFIG, type VehicleId } from '@/config';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatKm(km: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(km);
}

export function formatMinutes(minutes: number): string {
  const m = Math.round(minutes);
  if (m < 60) return `${m} menit`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h} jam` : `${h} jam ${rest} menit`;
}

export function formatDateID(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function calcFare(vehicleId: VehicleId, distanceKm: number): { trip: number; admin: number; total: number } {
  const cfg = FARE_CONFIG[vehicleId];
  const trip = distanceKm <= cfg.minimumDistance
    ? cfg.minimumFare
    : cfg.minimumFare + Math.ceil(distanceKm - cfg.minimumDistance) * cfg.additionalFarePerKm;
  const admin = FARE_CONFIG.adminFee;
  return { trip, admin, total: trip + admin };
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateBookingId(): string {
  let s = '';
  for (let i = 0; i < 5; i++) {
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `DC-ANJ-${s}`;
}

export function isValidWhatsAppNumber(input: string): boolean {
  const cleaned = input.replace(/[\s\-().]/g, '');
  if (!/^\d{8,15}$/.test(cleaned)) return false;
  if (cleaned.startsWith('0')) return cleaned.length >= 10 && cleaned.length <= 14;
  if (cleaned.startsWith('62')) return cleaned.length >= 10 && cleaned.length <= 15;
  return false;
}

export function normalizeWhatsApp(input: string): string {
  const cleaned = input.replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
  if (cleaned.startsWith('+62')) return '62' + cleaned.slice(3);
  if (cleaned.startsWith('62')) return cleaned;
  if (/^\d{8,15}$/.test(cleaned)) return '62' + cleaned;
  return cleaned;
}
