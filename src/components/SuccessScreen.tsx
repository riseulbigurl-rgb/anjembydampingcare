import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Home, Copy, ClipboardCheck, Info } from 'lucide-react';

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
      // fallback: select text area
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
        Teks booking sudah otomatis tersalin. Buka grup WhatsApp, lalu tempel dan kirim pesannya.
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

      <div className="mt-4 w-full rounded-2xl bg-anj-accent/8 p-4 text-left">
        <div className="flex items-start gap-2">
          <Info size={16} className="mt-0.5 shrink-0 text-anj-accent" />
          <p className="text-xs leading-relaxed text-anj-ink">
            <span className="font-bold">Langkah selanjutnya:</span><br />
            1. Tekan tombol <span className="font-bold">Buka WhatsApp</span> di bawah<br />
            2. Pilih grup kota Anda di WhatsApp<br />
            3. Tahan kolom pesan &gt; <span className="font-bold">Tempel</span><br />
            4. Tekan <span className="font-bold">Kirim</span>
          </p>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-anj-muted">Teks Booking</span>
          <button
            onClick={copyMessage}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              copied ? 'bg-green-100 text-green-600' : 'bg-anj-bg text-anj-accent hover:bg-anj-accent hover:text-white'
            }`}
          >
            {copied ? <><ClipboardCheck size={13} /> Tersalin</> : <><Copy size={13} /> Salin Ulang</>}
          </button>
        </div>
        <textarea
          readOnly
          value={message}
          rows={8}
          onClick={(e) => e.currentTarget.select()}
          className="w-full resize-none rounded-2xl border border-black/5 bg-white p-3.5 font-mono text-[11px] leading-relaxed text-anj-ink shadow-softer focus:outline-none"
        />
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
