import { Bike, Car } from 'lucide-react';
import type { VehicleId } from '@/config';
import type { RouteInfo } from '@/utils/booking';
import { calcFare, formatKm, formatRupiah } from '@/utils/format';

interface Props {
  vehicleId: VehicleId;
  route: RouteInfo;
}

export default function FareSummary({ vehicleId, route }: Props) {
  const { trip, admin, total } = calcFare(vehicleId, route.distanceKm);
  const isMotor = vehicleId === 'motor';

  return (
    <div className="card p-5 animate-fade-up">
      <p className="section-eyebrow">Estimasi Biaya</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-anj-accent/12 text-anj-accent">
          {isMotor ? <Bike size={26} /> : <Car size={26} />}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Kendaraan</p>
          <p className="text-base font-bold text-anj-ink">{isMotor ? 'Motor' : 'Mobil'}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Jarak</p>
          <p className="text-base font-bold text-anj-ink">{formatKm(route.distanceKm)} km</p>
        </div>
      </div>

      <div className="my-4 h-px bg-anj-bg" />

      <dl className="space-y-2.5">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-anj-muted">Tarif perjalanan</dt>
          <dd className="text-sm font-bold text-anj-ink">{formatRupiah(trip)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-anj-muted">Biaya admin</dt>
          <dd className="text-sm font-bold text-anj-ink">{formatRupiah(admin)}</dd>
        </div>
      </dl>

      <div className="my-4 h-px bg-anj-bg" />

      <div className="flex items-center justify-between">
        <span className="text-base font-extrabold text-anj-ink">TOTAL</span>
        <span className="text-2xl font-extrabold text-anj-accent">{formatRupiah(total)}</span>
      </div>
    </div>
  );
}
