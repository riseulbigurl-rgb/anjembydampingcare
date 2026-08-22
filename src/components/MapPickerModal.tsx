import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Search, X, Loader2, Check, Target } from 'lucide-react';
import type { PlaceInfo } from '@/utils/booking';
import { GOOGLE_MAPS_API_KEY } from '@/config';
import { loadGoogleMaps } from '@/utils/maps';

interface Props {
  open: boolean;
  title: string;
  initial?: PlaceInfo | null;
  onConfirm: (place: PlaceInfo) => void;
  onClose: () => void;
}

type Status = 'idle' | 'loading' | 'error';

export default function MapPickerModal({ open, title, initial, onConfirm, onClose }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [pending, setPending] = useState<PlaceInfo | null>(null);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const acServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const center = useMemo(() => {
    if (initial) return { lat: initial.lat, lng: initial.lng };
    return { lat: -7.5755, lng: 110.8243 }; // Solo
  }, [initial]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setStatus('idle');
    setErrorMsg('');
    setPending(initial ?? null);
    setSearchText(initial?.name ?? '');
    setSuggestions([]);

    loadGoogleMaps(GOOGLE_MAPS_API_KEY)
      .then((g) => {
        if (cancelled || !mapRef.current) return;
        const map = new g.maps.Map(mapRef.current, {
          center,
          zoom: initial ? 15 : 12,
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });
        mapInstanceRef.current = map;
        acServiceRef.current = new g.maps.places.AutocompleteService();
        placesServiceRef.current = new g.maps.places.PlacesService(map);
        geocoderRef.current = new g.maps.Geocoder();

        const marker = new g.maps.Marker({
          map,
          position: center,
          draggable: true,
          animation: g.maps.Animation.DROP,
        });
        markerRef.current = marker;

        const onPos = (lat: number, lng: number) => {
          setStatus('loading');
          geocoderRef.current?.geocode({ location: { lat, lng } }, (results, geoStatus) => {
            if (geoStatus !== 'OK' || !results || results.length === 0) {
              setStatus('error');
              setErrorMsg('Lokasi belum dapat dihitung. Silakan coba pilih ulang titik.');
              return;
            }
            const top = results[0];
            const place: PlaceInfo = {
              name: extractName(results, top),
              address: top.formatted_address,
              lat: round(lat),
              lng: round(lng),
            };
            setPending(place);
            setStatus('idle');
          });
        };

        marker.addListener('dragend', () => {
          const p = marker.getPosition();
          if (p) onPos(p.lat(), p.lng());
        });
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (lat == null || lng == null) return;
          marker.setPosition({ lat, lng });
          onPos(lat, lng);
        });

        if (initial) {
          // already have a pending place; no geocode needed
          setStatus('idle');
        }

        setReady(true);
      })
      .catch((e) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg(
          e.message === 'NO_API_KEY'
            ? 'Google Maps API belum dikonfigurasi. Tambahkan VITE_GOOGLE_MAPS_API_KEY pada environment.'
            : 'Gagal memuat Google Maps. Periksa koneksi internet Anda.'
        );
      });

    return () => {
      cancelled = true;
      markerRef.current?.setMap(null);
      markerRef.current = null;
      mapInstanceRef.current = null;
    };
  }, [open, center, initial]);

  const runSearch = (q: string) => {
    setSearchText(q);
    if (!acServiceRef.current || !q.trim()) {
      setSuggestions([]);
      return;
    }
    acServiceRef.current.getPlacePredictions(
      { input: q, componentRestrictions: { country: 'id' } },
      (preds, st) => {
        if (st !== google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions([]);
          return;
        }
        setSuggestions(preds ?? []);
      }
    );
  };

  const pickSuggestion = (pred: google.maps.places.AutocompletePrediction) => {
    if (!placesServiceRef.current) return;
    setStatus('loading');
    setSuggestions([]);
    placesServiceRef.current.getDetails(
      { placeId: pred.place_id, fields: ['name', 'formatted_address', 'geometry'] },
      (place, st) => {
        if (st !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry?.location) {
          setStatus('error');
          setErrorMsg('Lokasi tidak ditemukan. Coba kata kunci lain.');
          return;
        }
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        mapInstanceRef.current?.panTo({ lat, lng });
        mapInstanceRef.current?.setZoom(16);
        markerRef.current?.setPosition({ lat, lng });
        const info: PlaceInfo = {
          name: place.name ?? pred.structured_formatting?.main_text ?? '',
          address: place.formatted_address ?? pred.description,
          lat: round(lat),
          lng: round(lng),
        };
        setPending(info);
        setSearchText(info.name);
        setStatus('idle');
      }
    );
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        mapInstanceRef.current?.panTo({ lat, lng });
        mapInstanceRef.current?.setZoom(16);
        markerRef.current?.setPosition({ lat, lng });
        geocoderRef.current?.geocode({ location: { lat, lng } }, (results, st) => {
          if (st !== 'OK' || !results?.length) {
            setStatus('error');
            setErrorMsg('Lokasi belum dapat dihitung. Silakan coba pilih ulang titik.');
            return;
          }
          const top = results[0];
          setPending({
            name: extractName(results, top),
            address: top.formatted_address,
            lat: round(lat),
            lng: round(lng),
          });
          setStatus('idle');
        });
      },
      () => {
        setStatus('error');
        setErrorMsg('Tidak dapat mengakses lokasi Anda. Pilih titik manual pada peta.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-anj-ink/40 backdrop-blur-sm animate-fade-up">
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col bg-anj-bg shadow-2xl">
        <div className="flex items-center justify-between gap-3 bg-white px-4 py-3.5 shadow-softer">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-anj-accent/12 text-anj-accent">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold leading-tight text-anj-ink">{title}</h3>
              <p className="text-xs text-anj-muted">Geser pin atau cari alamat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-anj-muted transition hover:bg-anj-bg hover:text-anj-ink"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative bg-white px-4 pb-3 pt-3">
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
            <input
              ref={searchRef}
              value={searchText}
              onChange={(e) => runSearch(e.target.value)}
              placeholder="Cari alamat atau tempat…"
              className="w-full rounded-2xl border border-black/5 bg-anj-bg/50 py-3 pl-11 pr-4 text-[15px] placeholder:text-anj-muted/70 focus:border-anj-accent focus:bg-white focus:outline-none focus:ring-4 focus:ring-anj-accent/15"
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="mt-2 max-h-56 overflow-auto rounded-2xl bg-white shadow-soft">
              {suggestions.map((s) => (
                <li key={s.place_id}>
                  <button
                    onClick={() => pickSuggestion(s)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-anj-bg"
                  >
                    <MapPin size={16} className="mt-0.5 shrink-0 text-anj-accent" />
                    <div>
                      <p className="text-sm font-semibold leading-tight text-anj-ink">
                        {s.structured_formatting?.main_text ?? s.description}
                      </p>
                      <p className="text-xs text-anj-muted">
                        {s.structured_formatting?.secondary_text ?? ''}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={useCurrentLocation}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-anj-accent hover:underline"
          >
            <Target size={14} /> Gunakan lokasi saya sekarang
          </button>
        </div>

        <div className="relative flex-1">
          <div ref={mapRef} className="absolute inset-0" />
          {!ready && status !== 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-anj-bg">
              <Loader2 className="animate-spin text-anj-accent" size={28} />
              <p className="text-sm font-medium text-anj-muted">Memuat peta…</p>
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-4 shadow-soft">
              <p className="text-sm font-medium text-red-600">{errorMsg}</p>
            </div>
          )}
        </div>

        <div className="bg-white px-4 py-3.5 shadow-softer">
          {pending && status === 'idle' && (
            <div className="mb-3 rounded-2xl bg-anj-bg/60 p-3.5 animate-pop">
              <p className="text-sm font-bold text-anj-ink">{pending.name || 'Titik dipilih'}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-anj-muted">{pending.address}</p>
              <p className="mt-1 font-mono text-[11px] text-anj-muted">
                {pending.lat.toFixed(5)}, {pending.lng.toFixed(5)}
              </p>
            </div>
          )}
          <button
            disabled={!pending || status === 'loading'}
            onClick={() => pending && onConfirm(pending)}
            className="btn-primary w-full"
          >
            <Check size={18} /> Konfirmasi Lokasi
          </button>
        </div>
      </div>
    </div>
  );
}

function round(n: number): number {
  return Math.round(n * 1e5) / 1e5;
}

function extractName(results: google.maps.GeocoderResult[], top: google.maps.GeocoderResult): string {
  const priority = ['sublocality', 'neighborhood', 'premise', 'point_of_interest', 'route', 'locality'];
  for (const t of priority) {
    const r = results.find((x) => x.types.includes(t as string));
    if (r) return extractComponent(r, t) || r.formatted_address;
  }
  return top.formatted_address.split(',')[0];
}

function extractComponent(r: google.maps.GeocoderResult, type: string): string | null {
  const c = r.address_components.find((x) => x.types.includes(type));
  return c?.long_name ?? null;
}
