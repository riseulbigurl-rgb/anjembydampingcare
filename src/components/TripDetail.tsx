import { Flag, Ruler, Clock, Loader2, AlertTriangle, MapPin } from 'lucide-react';
import type { PlaceInfo, RouteInfo } from '@/utils/booking';
import { formatKm, formatMinutes } from '@/utils/format';
import { RouteMap } from '@/components/RouteMap';

interface Props {
  pickup: PlaceInfo | null;
  dropoff: PlaceInfo | null;
  route: RouteInfo | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string;
}

export default function TripDetail({ pickup, dropoff, route, status, error }: Props) {
  if (!pickup || !dropoff) return null;

  return (
    <div className="card overflow-hidden p-5 animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <span className="section-eyebrow">Detail Perjalanan</span>
      </div>

      {pickup && dropoff && <RouteMap pickup={pickup} dropoff={dropoff} />}

      <div className="mt-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-anj-accent/12 text-anj-accent">
            <MapPin size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Jemput</p>
            <p className="truncate text-sm font-semibold text-anj-ink">{pickup.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-anj-accent/12 text-anj-accent">
            <Flag size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Tujuan</p>
            <p className="truncate text-sm font-semibold text-anj-ink">{dropoff.address}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-anj-bg/60 p-3.5">
          <div className="flex items-center gap-1.5 text-anj-muted">
            <Ruler size={14} />
            <span className="text-[11px] font-bold uppercase tracking-wide">Jarak</span>
          </div>
          {status === 'loading' ? (
            <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-anj-muted">
              <Loader2 size={14} className="animate-spin" /> Menghitung…
            </span>
          ) : route ? (
            <p className="mt-1 text-xl font-extrabold text-anj-ink">{formatKm(route.distanceKm)} km</p>
          ) : (
            <p className="mt-1 text-sm font-semibold text-anj-muted">-</p>
          )}
        </div>
        <div className="rounded-2xl bg-anj-bg/60 p-3.5">
          <div className="flex items-center gap-1.5 text-anj-muted">
            <Clock size={14} />
            <span className="text-[11px] font-bold uppercase tracking-wide">Estimasi</span>
          </div>
          {status === 'loading' ? (
            <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-anj-muted">
              <Loader2 size={14} className="animate-spin" /> Menghitung…
            </span>
          ) : route ? (
            <p className="mt-1 text-xl font-extrabold text-anj-ink">{formatMinutes(route.durationMin)}</p>
          ) : (
            <p className="mt-1 text-sm font-semibold text-anj-muted">-</p>
          )}
        </div>
      </div>

      {status === 'loading' && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-anj-muted">
          <Loader2 size={13} className="animate-spin" /> Menghitung rute…
        </p>
      )}
      {status === 'error' && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-xs font-medium leading-relaxed text-red-600">
            {error || 'Lokasi belum dapat dihitung. Silakan coba pilih ulang titik jemput atau tujuan.'}
          </p>
        </div>
      )}
    </div>
  );
}
