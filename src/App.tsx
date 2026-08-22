import { useMemo, useState } from 'react';
import { Bike, Car, ChevronRight, Send, Sparkles, ShieldCheck, Clock4, MapPin } from 'lucide-react';
import { FARE_CONFIG, REGIONS, type VehicleId } from '@/config';
import type { BookingState, CustomerData, RouteInfo } from '@/utils/booking';
import { buildWhatsAppMessage, buildWhatsAppUrl } from '@/utils/booking';
import { calcFare, formatRupiah, generateBookingId, isValidWhatsAppNumber } from '@/utils/format';
import { estimateMinutes } from '@/utils/maps';
import RegionPicker from '@/components/RegionPicker';
import VehiclePicker, { regionName } from '@/components/VehiclePicker';
import LocationField from '@/components/LocationField';
import TripDetail from '@/components/TripDetail';
import FareSummary from '@/components/FareSummary';
import CustomerForm from '@/components/CustomerForm';
import ConfirmationCard from '@/components/ConfirmationCard';
import SuccessScreen from '@/components/SuccessScreen';
import StickyCTA from '@/components/StickyCTA';

const emptyCustomer: CustomerData = {
  name: '',
  whatsapp: '',
  date: '',
  time: '',
  passengers: 1,
  notes: '',
};

export default function App() {
  const [regionId, setRegionId] = useState('');
  const [vehicleId, setVehicleId] = useState<VehicleId | null>(null);
  const [pickupUrl, setPickupUrl] = useState('');
  const [dropoffUrl, setDropoffUrl] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [customer, setCustomer] = useState<CustomerData>(emptyCustomer);
  const [bookingId, setBookingId] = useState('');
  const [successUrl, setSuccessUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const distanceKm = parseFloat(distanceInput);
  const hasDistance = !isNaN(distanceKm) && distanceKm > 0;

  const route: RouteInfo | null = useMemo(() => {
    if (!hasDistance) return null;
    return { distanceKm, durationMin: estimateMinutes(distanceKm) };
  }, [distanceKm, hasDistance]);

  const fare = useMemo(() => {
    if (!vehicleId || !route) return null;
    return calcFare(vehicleId, route.distanceKm);
  }, [vehicleId, route]);

  const canSubmit =
    !!regionId &&
    !!vehicleId &&
    pickupUrl.trim().length > 0 &&
    dropoffUrl.trim().length > 0 &&
    hasDistance &&
    customer.name.trim().length > 1 &&
    isValidWhatsAppNumber(customer.whatsapp) &&
    !!customer.date &&
    !!customer.time;

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = () => {
    if (!canSubmit || !vehicleId || !route) return;
    const id = generateBookingId();
    setBookingId(id);
    const region = REGIONS.find((r) => r.id === regionId)!;
    const { trip, admin, total } = calcFare(vehicleId, route.distanceKm);
    const msg = buildWhatsAppMessage({
      bookingId: id,
      regionName: region.name,
      vehicleId,
      pickupUrl: pickupUrl.trim(),
      dropoffUrl: dropoffUrl.trim(),
      route,
      customer,
      trip,
      admin,
      total,
    });
    const url = buildWhatsAppUrl(region.whatsapp, msg);
    setSuccessUrl(url);
    setSuccessMessage(msg);
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setSuccessUrl('');
    setSuccessMessage('');
    setBookingId('');
    setRegionId('');
    setVehicleId(null);
    setPickupUrl('');
    setDropoffUrl('');
    setDistanceInput('');
    setCustomer(emptyCustomer);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-anj-bg">
        <Header />
        <SuccessScreen bookingId={bookingId} whatsappUrl={successUrl} message={successMessage} onHome={reset} />
        <Footer />
      </div>
    );
  }

  const booking: BookingState = {
    regionId,
    vehicleId: vehicleId ?? 'motor',
    pickupUrl,
    dropoffUrl,
    route,
    customer,
    bookingId,
  };

  return (
    <div className="min-h-screen bg-anj-bg pb-24 md:pb-0">
      <Header />

      <main className="mx-auto max-w-2xl px-4">
        <Hero onCta={scrollToBooking} />

        <section id="booking" className="scroll-mt-4 space-y-5 pb-10 pt-2">
          <Step n={1} title="Pilih Wilayah Layanan" done={!!regionId}>
            <RegionPicker value={regionId} onChange={setRegionId} />
          </Step>

          <Step n={2} title="Pilih Kendaraan" disabled={!regionId} done={!!vehicleId}>
            {!regionId ? (
              <Hint text="Pilih wilayah dulu untuk melanjutkan." />
            ) : (
              <VehiclePicker value={vehicleId} onChange={setVehicleId} />
            )}
          </Step>

          <Step n={3} title="Titik Jemput" disabled={!vehicleId} done={pickupUrl.trim().length > 0}>
            {!vehicleId ? (
              <Hint text="Pilih kendaraan dulu untuk melanjutkan." />
            ) : (
              <LocationField
                label="📍 Link Google Maps titik jemput"
                placeholder="Tempel link Google Maps lokasi jemput"
                value={pickupUrl}
                onChange={setPickupUrl}
              />
            )}
          </Step>

          <Step n={4} title="Titik Antar" disabled={pickupUrl.trim().length === 0} done={dropoffUrl.trim().length > 0}>
            {pickupUrl.trim().length === 0 ? (
              <Hint text="Masukkan link titik jemput dulu untuk melanjutkan." />
            ) : (
              <LocationField
                label="📍 Link Google Maps titik antar"
                placeholder="Tempel link Google Maps lokasi tujuan"
                value={dropoffUrl}
                onChange={setDropoffUrl}
              />
            )}
          </Step>

          {pickupUrl.trim() && dropoffUrl.trim() && (
            <Step n={5} title="Jarak & Detail Perjalanan" done={hasDistance}>
              <TripDetail
                pickupUrl={pickupUrl.trim()}
                dropoffUrl={dropoffUrl.trim()}
                distanceKm={distanceInput}
                onDistanceChange={setDistanceInput}
                durationMin={route?.durationMin ?? null}
              />
            </Step>
          )}

          {vehicleId && route && (
            <Step n={6} title="Estimasi Biaya" done>
              <FareSummary vehicleId={vehicleId} route={route} />
            </Step>
          )}

          {route && (
            <Step n={7} title="Data Pemesan" done={!!customer.name && isValidWhatsAppNumber(customer.whatsapp) && !!customer.date && !!customer.time}>
              <CustomerForm value={customer} onChange={setCustomer} />
            </Step>
          )}

          {canSubmit && (
            <div className="space-y-4 animate-fade-up">
              <p className="section-eyebrow text-center">Konfirmasi</p>
              <ConfirmationCard booking={booking} />
              <button onClick={submit} className="btn-primary w-full text-base">
                <Send size={18} /> Kirim Booking ke WhatsApp
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <StickyCTA total={fare?.total ?? null} canSubmit={canSubmit} onSubmit={submit} />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-anj-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-anj-accent text-white shadow-accent">
            <Bike size={20} />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold text-anj-ink">Anjem Dampingcare</p>
            <p className="text-[11px] font-medium text-anj-muted">Antar & Jemput Aman</p>
          </div>
        </div>
        <a
          href="#booking"
          className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-anj-accent shadow-softer transition hover:bg-anj-accent hover:text-white sm:inline-flex"
        >
          Pesan Sekarang
        </a>
      </div>
    </header>
  );
}

function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="relative overflow-hidden px-1 py-8 sm:py-12">
      <div className="relative z-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-anj-accent shadow-softer">
          <Sparkles size={13} /> Layanan Antar-Jemput Dampingcare
        </span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-anj-ink sm:text-5xl">
          Anjem <span className="text-anj-accent">Dampingcare</span>
        </h1>
        <p className="mt-3 text-lg font-semibold text-anj-ink">Antar & Jemput dengan Aman, Praktis, dan Nyaman</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-anj-muted">
          Pesan layanan antar-jemput Dampingcare dengan mudah. Pilih kendaraan, tentukan titik jemput dan tujuan, lalu
          dapatkan estimasi jarak dan biaya perjalanan secara otomatis.
        </p>
        <button onClick={onCta} className="btn-primary mt-6">
          Pesan Anjem <ChevronRight size={18} />
        </button>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <Pill icon={ShieldCheck} text="Aman & Terpercaya" />
          <Pill icon={Clock4} text="Tepat Waktu" />
          <Pill icon={MapPin} text="7 Kota Layanan" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <HeroVehicle icon={Bike} label="Anjem Motor" price={`Mulai ${formatRupiah(FARE_CONFIG.motor.minimumFare)}`} />
          <HeroVehicle icon={Car} label="Anjem Mobil" price={`Mulai ${formatRupiah(FARE_CONFIG.mobil.minimumFare)}`} />
        </div>
      </div>
    </section>
  );
}

function HeroVehicle({ icon: Icon, label, price }: { icon: typeof Bike; label: string; price: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-anj-bg text-anj-accent">
        <Icon size={26} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-sm font-bold text-anj-ink">{label}</p>
        <p className="text-xs font-semibold text-anj-accent">{price}</p>
      </div>
    </div>
  );
}

function Pill({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-anj-ink shadow-softer">
      <Icon size={13} className="text-anj-accent" /> {text}
    </span>
  );
}

function Step({
  n,
  title,
  children,
  disabled,
  done,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  done?: boolean;
}) {
  return (
    <div className={`transition ${disabled ? 'opacity-50' : ''}`}>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
            done ? 'bg-anj-accent text-white' : 'bg-white text-anj-muted shadow-softer'
          }`}
        >
          {done ? '✓' : n}
        </span>
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-black/10 bg-white/40 px-4 py-3.5 text-center text-sm font-medium text-anj-muted">
      {text}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/60">
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-anj-accent text-white">
            <Bike size={18} />
          </div>
          <p className="text-base font-extrabold text-anj-ink">Dampingcare</p>
        </div>
        <p className="mt-1 text-sm font-semibold text-anj-ink">Anjem Dampingcare</p>
        <p className="mt-1 text-xs leading-relaxed text-anj-muted">
          Solo • Sukoharjo • Boyolali • Karanganyar • Sragen • Klaten • Yogyakarta
        </p>
      </div>
    </footer>
  );
}
