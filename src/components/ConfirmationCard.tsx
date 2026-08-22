import { Bike, Car, MapPin, Flag, Ruler, Clock, Calendar, Clock3, User, Phone, Users, StickyNote, Receipt, ExternalLink } from 'lucide-react';
import type { BookingState } from '@/utils/booking';
import { calcFare, formatDateID, formatKm, formatMinutes, formatRupiah } from '@/utils/format';
import { regionName } from '@/components/VehiclePicker';

interface Props {
  booking: BookingState;
}

export default function ConfirmationCard({ booking }: Props) {
  const v = booking.vehicleId;
  const { trip, admin, total } = calcFare(v, booking.route!.distanceKm);
  const region = regionName(booking.regionId);

  const rows = [
    { icon: Ruler, label: 'Jarak', value: `${formatKm(booking.route!.distanceKm)} km` },
    { icon: Clock, label: 'Estimasi perjalanan', value: formatMinutes(booking.route!.durationMin) },
    { icon: Calendar, label: 'Tanggal', value: formatDateID(booking.customer.date) },
    { icon: Clock3, label: 'Jam', value: `${booking.customer.time} WIB` },
    { icon: User, label: 'Nama', value: booking.customer.name },
    { icon: Phone, label: 'WhatsApp', value: booking.customer.whatsapp },
    { icon: Users, label: 'Jumlah penumpang', value: `${booking.customer.passengers} orang` },
    { icon: StickyNote, label: 'Catatan', value: booking.customer.notes || '-' },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="bg-anj-accent px-5 py-4 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">Konfirmasi Booking</p>
        <p className="mt-0.5 text-sm font-bold">{booking.bookingId}</p>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-anj-bg/60 p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-anj-accent shadow-softer">
              {v === 'motor' ? <Bike size={22} /> : <Car size={22} />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Wilayah</p>
              <p className="text-sm font-bold text-anj-ink">{region}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Kendaraan</p>
            <p className="text-sm font-bold text-anj-ink">{v === 'motor' ? '🛵 Motor' : '🚗 Mobil'}</p>
          </div>
        </div>

        <div className="mb-4 space-y-3 rounded-2xl bg-anj-bg/40 p-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-anj-accent shadow-softer">
              <MapPin size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Titik Jemput</p>
              <p className="break-all text-sm font-semibold text-anj-ink">{booking.pickupUrl}</p>
              <a
                href={booking.pickupUrl.startsWith('http') ? booking.pickupUrl : `https://${booking.pickupUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-anj-accent hover:underline"
              >
                <ExternalLink size={11} /> Lihat di Maps
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-anj-accent shadow-softer">
              <Flag size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Titik Antar</p>
              <p className="break-all text-sm font-semibold text-anj-ink">{booking.dropoffUrl}</p>
              <a
                href={booking.dropoffUrl.startsWith('http') ? booking.dropoffUrl : `https://${booking.dropoffUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-anj-accent hover:underline"
              >
                <ExternalLink size={11} /> Lihat di Maps
              </a>
            </div>
          </div>
        </div>

        <dl className="space-y-3">
          {rows.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-anj-bg text-anj-accent">
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-anj-muted">{r.label}</dt>
                  <dd className="text-sm font-semibold leading-snug text-anj-ink">{r.value || '-'}</dd>
                </div>
              </div>
            );
          })}
        </dl>

        <div className="mt-5 rounded-2xl bg-anj-bg/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-anj-ink">
            <Receipt size={15} />
            <span className="text-xs font-bold uppercase tracking-wide">Rincian Biaya</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-anj-muted">Tarif perjalanan</span>
              <span className="font-semibold text-anj-ink">{formatRupiah(trip)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-anj-muted">Biaya admin</span>
              <span className="font-semibold text-anj-ink">{formatRupiah(admin)}</span>
            </div>
          </div>
          <div className="my-2.5 h-px bg-anj-accent/20" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-anj-ink">TOTAL</span>
            <span className="text-xl font-extrabold text-anj-accent">{formatRupiah(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
