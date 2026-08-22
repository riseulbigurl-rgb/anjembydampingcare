import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Home, Copy, ClipboardCheck } from 'lucide-react';

interface Props {
  bookingId: string;
  whatsappUrl: string;
  message: string;
  onHome: () => void;
}

export default function SuccessScreen({ bookingId, whatsappUrl, message, onHome }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback handled by textarea select
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-start px-5 py-10 text-center">
      <div className="mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-anj-accent/12 animate-pop">
          <CheckCircle2 size={56} className="text-anj-accent" strokeWidth={2} />
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-anj-ink">Booking Anjem Siap Dikirim</h2>
      <p className="mt-2 text-sm leading-relaxed text-anj-muted">
        Pilih salah satu cara mengirim pesan booking ke grup driver di bawah ini.
      </p>

      <div className="mt-6 w-full rounded-2xl bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-anj-muted">Booking ID</p>
            <p className="text-lg font-extrabold text-anj-ink">{bookingId}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wide text-amber-500">Menunggu Konfirmasi</span>
          </div>
        </div>
      </div>

      <div className="mt-5 w-full space-y-3">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
          <MessageCircle size={18} /> Kirim ke Grup WhatsApp
        </a>
        <button onClick={copyMessage} className="btn-ghost w-full">
          {copied ? <><ClipboardCheck size={18} /> Tersalin!</> : <><Copy size={18} /> Salin Teks Booking</>}
        </button>
      </div>

      <p className="mt-3 w-full text-left text-[11px] leading-relaxed text-anj-muted">
        <span className="font-bold">Kirim ke Grup WhatsApp</span> akan langsung membuka grup dengan teks pesan. Jika teks tidak muncul otomatis di beberapa versi WhatsApp, gunakan tombol <span className="font-bold">Salin Teks Booking</span> lalu tempelkan secara manual di grup.
      </p>

      <div className="mt-4 w-full">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-anj-muted">Teks Booking</span>
        <textarea
          readOnly
          value={message}
          rows={8}
          onClick={(e) => e.currentTarget.select()}
          className="w-full resize-none rounded-2xl border border-black/5 bg-white p-3.5 font-mono text-[11px] leading-relaxed text-anj-ink shadow-softer focus:outline-none"
        />
      </div>

      <div className="mt-5 w-full">
        <button onClick={onHome} className="btn-ghost w-full">
          <Home size={18} /> Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
