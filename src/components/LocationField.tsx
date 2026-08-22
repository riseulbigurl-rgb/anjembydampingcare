import { Link2, MapPin, ExternalLink, Info } from 'lucide-react';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function LocationField({ label, placeholder, value, onChange, disabled }: Props) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-sm font-semibold text-anj-ink">{label}</span>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <div className="relative">
          <Link2 size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-black/5 bg-anj-bg/40 py-3 pl-11 pr-4 text-[15px] placeholder:text-anj-muted/70 transition focus:border-anj-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-anj-accent/15 disabled:opacity-40"
          />
        </div>

        {value.trim() && (
          <a
            href={value.trim().startsWith('http') ? value.trim() : `https://${value.trim()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-anj-accent hover:underline"
          >
            <ExternalLink size={13} /> Lihat di Google Maps
          </a>
        )}

        <div className="mt-2.5 flex items-start gap-1.5 rounded-xl bg-anj-bg/50 p-2.5">
          <Info size={13} className="mt-0.5 shrink-0 text-anj-accent" />
          <p className="text-[11px] leading-relaxed text-anj-muted">
            Buka Google Maps &gt; cari lokasi &gt; tap titik &gt; <span className="font-semibold">Share</span> &gt; <span className="font-semibold">Salin link</span>, lalu tempelkan link di atas.
          </p>
        </div>
      </div>
    </div>
  );
}
