import { useEffect, useRef, useState } from 'react';
import type { PlaceInfo, RouteInfo } from '@/utils/booking';
import { GOOGLE_MAPS_API_KEY } from '@/config';
import { loadGoogleMaps } from '@/utils/maps';

type RouteStatus = 'idle' | 'loading' | 'success' | 'error';

export function useDirections(pickup: PlaceInfo | null, dropoff: PlaceInfo | null) {
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [status, setStatus] = useState<RouteStatus>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!pickup || !dropoff) {
      setRoute(null);
      setStatus('idle');
      return;
    }
    let cancelled = false;
    setStatus('loading');
    setError('');

    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then((g) => {
        if (cancelled) return;
        const service = new g.maps.DirectionsService();
        service.route(
          {
            origin: { lat: pickup.lat, lng: pickup.lng },
            destination: { lat: dropoff.lat, lng: dropoff.lng },
            travelMode: g.maps.TravelMode.DRIVING,
          },
          (result, st) => {
            if (cancelled) return;
            if (st !== g.maps.DirectionsStatus.OK || !result?.routes?.length) {
              setStatus('error');
              setError('Lokasi belum dapat dihitung. Silakan coba pilih ulang titik jemput atau tujuan.');
              setRoute(null);
              return;
            }
            const leg = result.routes[0].legs[0];
            setRoute({
              distanceKm: (leg.distance?.value ?? 0) / 1000,
              durationMin: (leg.duration?.value ?? 0) / 60,
            });
            setStatus('success');
          }
        );
      })
      .catch(() => {
        if (cancelled) return;
        setStatus('error');
        setError('Gagal memuat Google Maps untuk menghitung rute.');
      });

    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff]);

  return { route, status, error };
}

export function RouteMap({ pickup, dropoff }: { pickup: PlaceInfo | null; dropoff: PlaceInfo | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then((g) => {
        if (cancelled || !ref.current) return;
        const map = new g.maps.Map(ref.current, {
          center: pickup ?? { lat: -7.5755, lng: 110.8243 },
          zoom: 12,
          disableDefaultUI: true,
        });
        setReady(true);

        const bounds = new g.maps.LatLngBounds();
        if (pickup) {
          new g.maps.Marker({ map, position: pickup, label: 'A' });
          bounds.extend(pickup);
        }
        if (dropoff) {
          new g.maps.Marker({ map, position: dropoff, label: 'B' });
          bounds.extend(dropoff);
        }

        if (pickup && dropoff) {
          const service = new g.maps.DirectionsService();
          const renderer = new g.maps.DirectionsRenderer({ suppressMarkers: true, polylineOptions: { strokeColor: '#FB5EA8', strokeWeight: 5 } });
          renderer.setMap(map);
          service.route(
            {
              origin: pickup,
              destination: dropoff,
              travelMode: g.maps.TravelMode.DRIVING,
            },
            (res, st) => {
              if (st === g.maps.DirectionsStatus.OK && res) {
                renderer.setDirections(res);
                const b = res.routes[0].legs[0];
                if (b?.start_location) bounds.extend(b.start_location);
                if (b?.end_location) bounds.extend(b.end_location);
                map.fitBounds(bounds, 60);
              } else if (pickup && dropoff) {
                map.fitBounds(bounds, 60);
              }
            }
          );
        } else {
          map.fitBounds(bounds, 60);
        }
      })
      .catch(() => {
        // silent — the inline preview just won't render
      });
    return () => {
      cancelled = true;
    };
  }, [pickup, dropoff]);

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-anj-bg">
      <div ref={ref} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-anj-bg">
          <span className="text-xs font-medium text-anj-muted">Memuat peta…</span>
        </div>
      )}
    </div>
  );
}
