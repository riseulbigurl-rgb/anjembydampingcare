import { Flag, Ruler, Clock, MapPin, ExternalLink, Info } from 'lucide-react';
import type { PlaceInfo, RouteInfo } from '@/utils/booking';
import { formatKm, formatMinutes } from '@/utils/format';

interface Props {
  pickup: PlaceInfo | null;
  dropoff: PlaceInfo | null;
  route: RouteInfo | null;
}

export default function TripDetail({ pickup, dropoff, route }: Props) {
  if (!pickup || !dropoff) return null;

  return (
    <div className="card overflow-hidden p-5 animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <span className="section-eyebrow">Detail Perjalanan</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-anj-accent/12 text-anj-accent">
            <MapPin size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Jemput</p>
            <p className="break-all text-sm font-semibold text-anj-ink">{pickup.url}</p>
            <a
              href={pickup.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-anj-accent hover:underline"
            >
              <ExternalLink size={11} /> Lihat di Maps
            </a>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-anj-accent/12 text-anj-accent">
            <Flag size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Tujuan</p>
            <p className="break-all text-sm font-semibold text-anj-ink">{dropoff.url}</p>
            <a
              href={dropoff.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-anj-accent hover:underline"
            >
              <ExternalLink size={11} /> Lihat di Maps
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-anj-bg/60 p-3.5">
          <div className="flex items-center gap-1.5 text-anj-muted">
            <Ruler size={14} />
            <span className="text-[11px] font-bold uppercase tracking-wide">Jarak</span>
          </div>
          {route ? (
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
          {route ? (
            <p className="mt-1 text-xl font-extrabold text-anj-ink">{formatMinutes(route.durationMin)}</p>
          ) : (
            <p className="mt-1 text-sm font-semibold text-anj-muted">-</p>
          )}
        </div>
      </div>

      {route && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-anj-bg/50 p-3">
          <Info size={14} className="mt-0.5 shrink-0 text-anj-accent" />
          <p className="text-[11px] leading-relaxed text-anj-muted">
            Jarak dihitung berdasarkan koordinat dari link Google Maps yang Anda masukkan, dengan faktor jalan sebenarnya. Estimasi final dapat berbeda tergantung rute driver.
          </p>
        </div>
      )}
    </div>
  );
}
