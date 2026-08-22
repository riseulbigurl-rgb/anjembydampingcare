import { MapPin, Pencil, Loader2, Navigation } from 'lucide-react';
import type { PlaceInfo } from '@/utils/booking';

interface Props {
  label: string;
  placeholder: string;
  place: PlaceInfo | null;
  onPick: () => void;
  onChange: () => void;
  disabled?: boolean;
}

export default function LocationField({ label, placeholder, place, onPick, onChange, disabled }: Props) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-semibold text-anj-ink">{label}</span>
      </div>
      {place ? (
        <div className="rounded-2xl bg-white p-4 shadow-soft animate-pop">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-anj-accent/12 text-anj-accent">
              <MapPin size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-anj-ink">{place.name || 'Titik dipilih'}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-anj-muted">{place.address}</p>
              <p className="mt-1 font-mono text-[11px] text-anj-muted">
                {place.lat.toFixed(5)}, {place.lng.toFixed(5)}
              </p>
            </div>
          </div>
          <button
            onClick={onChange}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-anj-accent hover:underline"
          >
            <Pencil size={13} /> Ubah Lokasi
          </button>
        </div>
      ) : (
        <button
          onClick={onPick}
          disabled={disabled}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-anj-accent/30 bg-white/60 px-4 py-4 text-left transition hover:border-anj-accent hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-anj-accent text-white">
            <Navigation size={18} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-anj-ink">{placeholder}</p>
            <p className="text-xs text-anj-muted">Pilih lokasi via Google Maps</p>
          </div>
        </button>
      )}
    </div>
  );
}

export function LoadingLocation() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft">
      <Loader2 className="animate-spin text-anj-accent" size={18} />
      <span className="text-sm font-medium text-anj-muted">Sedang mengambil lokasi…</span>
    </div>
  );
}
