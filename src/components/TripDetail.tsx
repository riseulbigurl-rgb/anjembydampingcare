import { Flag, Ruler, Clock, MapPin, ExternalLink, Info, Navigation } from 'lucide-react';
import { formatKm, formatMinutes } from '@/utils/format';

interface Props {
  pickupUrl: string;
  dropoffUrl: string;
  distanceKm: string;
  onDistanceChange: (km: string) => void;
  durationMin: number | null;
}

export default function TripDetail({ pickupUrl, dropoffUrl, distanceKm, onDistanceChange, durationMin }: Props) {
  const km = parseFloat(distanceKm);

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
            <p className="break-all text-sm font-semibold text-anj-ink">{pickupUrl}</p>
            <a
              href={pickupUrl.startsWith('http') ? pickupUrl : `https://${pickupUrl}`}
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
            <p className="break-all text-sm font-semibold text-anj-ink">{dropoffUrl}</p>
            <a
              href={dropoffUrl.startsWith('http') ? dropoffUrl : `https://${dropoffUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-anj-accent hover:underline"
            >
              <ExternalLink size={11} /> Lihat di Maps
            </a>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-anj-bg/50 p-4">
        <div className="mb-2 flex items-start gap-2">
          <Navigation size={14} className="mt-0.5 shrink-0 text-anj-accent" />
          <p className="text-xs leading-relaxed text-anj-muted">
            Cek jarak dari titik jemput ke titik antar di Google Maps, lalu tuliskan jaraknya di bawah ini.
          </p>
        </div>
        <label className="field-label">📏 Jarak perjalanan (km)</label>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          value={distanceKm}
          onChange={(e) => onDistanceChange(e.target.value)}
          placeholder="Contoh: 5.2"
          className="field-input"
        />
      </div>

      {!isNaN(km) && km > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 animate-fade-up">
          <div className="rounded-2xl bg-anj-bg/60 p-3.5">
            <div className="flex items-center gap-1.5 text-anj-muted">
              <Ruler size={14} />
              <span className="text-[11px] font-bold uppercase tracking-wide">Jarak</span>
            </div>
            <p className="mt-1 text-xl font-extrabold text-anj-ink">{formatKm(km)} km</p>
          </div>
          <div className="rounded-2xl bg-anj-bg/60 p-3.5">
            <div className="flex items-center gap-1.5 text-anj-muted">
              <Clock size={14} />
              <span className="text-[11px] font-bold uppercase tracking-wide">Estimasi</span>
            </div>
            {durationMin != null ? (
              <p className="mt-1 text-xl font-extrabold text-anj-ink">{formatMinutes(durationMin)}</p>
            ) : (
              <p className="mt-1 text-sm font-semibold text-anj-muted">-</p>
            )}
          </div>
        </div>
      )}

      {!isNaN(km) && km > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-anj-bg/50 p-3">
          <Info size={14} className="mt-0.5 shrink-0 text-anj-accent" />
          <p className="text-[11px] leading-relaxed text-anj-muted">
            Estimasi waktu dihitung dari jarak yang Anda masukkan. Estimasi final dapat berbeda tergantung rute driver.
          </p>
        </div>
      )}
    </div>
  );
}
