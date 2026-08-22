import { ChevronDown, Check, MapPin } from 'lucide-react';
import { useState } from 'react';
import { REGIONS } from '@/config';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function RegionPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = REGIONS.find((r) => r.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left shadow-softer transition ${
          selected ? 'border-anj-accent/40' : 'border-black/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${selected ? 'bg-anj-accent text-white' : 'bg-anj-bg text-anj-accent'}`}>
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Wilayah Layanan</p>
            <p className={`text-[15px] font-bold ${selected ? 'text-anj-ink' : 'text-anj-muted'}`}>
              {selected ? selected.name : 'Pilih kota layanan'}
            </p>
          </div>
        </div>
        <ChevronDown size={18} className={`text-anj-muted transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="mt-2 overflow-hidden rounded-2xl bg-white shadow-soft animate-fade-up">
          {REGIONS.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => {
                  onChange(r.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-anj-bg"
              >
                <span className="text-sm font-semibold text-anj-ink">{r.name}</span>
                {r.id === value && <Check size={16} className="text-anj-accent" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
