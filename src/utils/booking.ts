import type { VehicleId } from '@/config';
import { FARE_CONFIG } from '@/config';
import { formatKm, formatMinutes, formatRupiah } from '@/utils/format';

export interface RouteInfo {
  distanceKm: number;
  durationMin: number;
}

export interface CustomerData {
  name: string;
  whatsapp: string;
  date: string;
  time: string;
  passengers: number;
  notes: string;
}

export interface BookingState {
  regionId: string;
  vehicleId: VehicleId;
  pickupUrl: string;
  dropoffUrl: string;
  route: RouteInfo | null;
  customer: CustomerData;
  bookingId: string;
}

export function buildWhatsAppMessage(b: {
  bookingId: string;
  regionName: string;
  vehicleId: VehicleId;
  pickupUrl: string;
  dropoffUrl: string;
  route: RouteInfo;
  customer: CustomerData;
  trip: number;
  admin: number;
  total: number;
}): string {
  const v = FARE_CONFIG[b.vehicleId];
  const vehicleLabel = `${v.emoji} ${v.label}`;
  return [
    `${v.emoji} BOOKING ANJEM DAMPINGCARE`,
    `Booking ID: ${b.bookingId}`,
    '',
    'DATA CUSTOMER',
    `Nama: ${b.customer.name}`,
    `WhatsApp: ${b.customer.whatsapp}`,
    `Wilayah: ${b.regionName}`,
    '',
    'KENDARAAN',
    vehicleLabel,
    '',
    'PERJALANAN',
    '📍 Titik Jemput:',
    b.pickupUrl,
    '',
    '📍 Titik Antar:',
    b.dropoffUrl,
    '',
    '📏 Jarak:',
    `${formatKm(b.route.distanceKm)} km`,
    '',
    '⏱ Estimasi:',
    formatMinutes(b.route.durationMin),
    '',
    'JADWAL',
    `Tanggal: ${b.customer.date}`,
    `Jam: ${b.customer.time} WIB`,
    `Jumlah Penumpang: ${b.customer.passengers}`,
    '',
    'Catatan:',
    b.customer.notes || '-',
    '',
    'RINCIAN BIAYA',
    `Tarif perjalanan: ${formatRupiah(b.trip)}`,
    `Biaya admin: ${formatRupiah(b.admin)}`,
    '',
    `TOTAL: ${formatRupiah(b.total)}`,
    '',
    'Mohon konfirmasi ketersediaan driver Anjem Dampingcare.',
  ].join('\n');
}

export function buildWhatsAppUrl(groupLink: string, message: string): string {
  return `${groupLink}?text=${encodeURIComponent(message)}`;
}
