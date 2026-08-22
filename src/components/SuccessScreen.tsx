import { useEffect } from 'react';
import { CheckCircle2, MessageCircle, Home, Copy } from 'lucide-react';

interface Props {
  bookingId: string;
  whatsappUrl: string;
  onHome: () => void;
}

export default function SuccessScreen({ bookingId, whatsappUrl, onHome }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyId = () => {
    navigator.clipboard?.writeText(bookingId).catch(() => {});
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-5 py-10 text-center">
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-anj-accent/12 animate-pop">
          <CheckCircle2 size={56} className="text-anj-accent" strokeWidth={2} />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-anj-ink">Booking Anjem Siap Dikirim</h2>
      <p className="mt-2 text-sm leading-relaxed text-anj-muted">
        Detail booking Anda telah disiapkan. Buka WhatsApp untuk mengirim ke grup driver Anjem Dampingcare.
      </p>

      <div className="mt-6 w-full rounded-2xl bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Booking ID</p>
            <p className="text-lg font-extrabold text-anj-ink">{bookingId}</p>
          </div>
          <button
            onClick={copyId}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-anj-bg text-anj-accent transition hover:bg-anj-accent hover:text-white"
            aria-label="Salin ID"
          >
            <Copy size={16} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wide text-amber-500">Menunggu Konfirmasi</span>
        </div>
      </div>

      <div className="mt-6 w-full space-y-3">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
          <MessageCircle size={18} /> Buka WhatsApp
        </a>
        <button onClick={onHome} className="btn-ghost w-full">
          <Home size={18} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
