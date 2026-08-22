import { REGIONS, VEHICLES, type VehicleId } from '@/config';
import { formatRupiah } from '@/utils/format';

interface Props {
  value: VehicleId | null;
  onChange: (id: VehicleId) => void;
}

export default function VehiclePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {VEHICLES.map((v) => {
        const active = value === v.id;
        const Icon = v.icon;
        return (
          <button
            key={v.id}
            onClick={() => onChange(v.id)}
            className={`group relative overflow-hidden rounded-3xl p-5 text-left transition-all duration-200 ${
              active
                ? 'bg-anj-accent text-white shadow-accent'
                : 'bg-white text-anj-ink shadow-soft hover:shadow-soft hover:bg-anj-bg/40'
            } animate-pop`}
          >
            <div className="flex items-start justify-between">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${active ? 'bg-white/20' : 'bg-anj-bg'}`}>
                <Icon size={30} strokeWidth={1.8} />
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  active ? 'bg-white/25 text-white' : 'bg-anj-accent/12 text-anj-accent'
                }`}
              >
                {v.label}
              </span>
            </div>
            <p className={`mt-4 text-base font-bold ${active ? 'text-white' : 'text-anj-ink'}`}>{v.short}</p>
            <p className={`mt-0.5 text-sm ${active ? 'text-white/80' : 'text-anj-muted'}`}>{v.description}</p>
            <p className={`mt-3 text-sm font-semibold ${active ? 'text-white' : 'text-anj-accent'}`}>
              Mulai dari {formatRupiah(v.minimumFare)}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export function regionName(id: string): string {
  return REGIONS.find((r) => r.id === id)?.name ?? '';
}
