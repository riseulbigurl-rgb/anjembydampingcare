import { useState } from 'react';
import { MapPin, Link2, AlertCircle, CheckCircle2, ExternalLink, Pencil } from 'lucide-react';
import type { PlaceInfo } from '@/utils/booking';
import { parseMapsUrl, isShortLink } from '@/utils/maps';

interface Props {
  label: string;
  placeholder: string;
  place: PlaceInfo | null;
  onConfirm: (place: PlaceInfo) => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function LocationField({ label, placeholder, place, onConfirm, onClear, disabled }: Props) {
  const [url, setUrl] = useState('');
  const [touched, setTouched] = useState(false);

  const trimmed = url.trim();
  const parsed = trimmed ? parseMapsUrl(trimmed) : null;
  const isShort = trimmed ? isShortLink(trimmed) : false;
  const showInvalid = touched && trimmed && !parsed && !isShort;
  const showShortHint = touched && trimmed && isShort;

  const submit = () => {
    setTouched(true);
    if (!parsed) return;
    onConfirm({ url: trimmed, lat: parsed.lat, lng: parsed.lng });
    setUrl('');
    setTouched(false);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-semibold text-anj-ink">{label}</span>
      </div>

      {place ? (
        <div className="rounded-2xl bg-white p-4 shadow-soft animate-pop">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-anj-accent/12 text-anj-accent">
              <CheckCircle2 size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-anj-ink">Lokasi terkonfirmasi</p>
              <p className="mt-0.5 break-all text-xs leading-relaxed text-anj-muted">{place.url}</p>
              <p className="mt-1 font-mono text-[11px] text-anj-muted">
                {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-anj-accent hover:underline"
            >
              <ExternalLink size={13} /> Lihat di Maps
            </a>
            <span className="text-anj-muted/40">•</span>
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-anj-muted hover:text-anj-accent"
            >
              <Pencil size={13} /> Ubah Lokasi
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <div className="relative">
            <Link2 size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              disabled={disabled}
              placeholder={placeholder}
              className={`w-full rounded-2xl border bg-anj-bg/40 py-3 pl-11 pr-4 text-[15px] placeholder:text-anj-muted/70 transition focus:bg-white focus:outline-none focus:ring-4 focus:ring-anj-accent/15 disabled:opacity-40 ${
                showInvalid ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-black/5 focus:border-anj-accent'
              }`}
            />
          </div>

          {showInvalid && (
            <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              Link tidak dikenali. Salin link dari Google Maps (klik Share &gt; Salin link), lalu tempelkan di sini.
            </p>
          )}
          {showShortHint && (
            <p className="mt-2 flex items-start gap-1.5 text-xs font-medium text-amber-600">
              <AlertCircle size={13} className="mt-0.5 shrink-0" />
              Link pendek terdeteksi. Buka link tersebut, salin link penuhnya dari address bar, lalu tempelkan kembali di sini.
            </p>
          )}

          <button
            onClick={submit}
            disabled={!parsed || disabled}
            className="btn-primary mt-3 w-full"
          >
            <MapPin size={18} /> Konfirmasi Lokasi
          </button>

          <p className="mt-2.5 text-center text-[11px] leading-relaxed text-anj-muted">
            Buka Google Maps &gt; cari lokasi &gt; tap titik &gt; <span className="font-semibold">Share</span> &gt; <span className="font-semibold">Salin link</span>, lalu tempelkan link di atas.
          </p>
        </div>
      )}
    </div>
  );
}
