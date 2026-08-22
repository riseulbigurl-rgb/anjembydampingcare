import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Home, Copy, ClipboardCheck, Send, AlertCircle, Users } from 'lucide-react';

interface Props {
  bookingId: string;
  whatsappUrl: string;
  message: string;
  regionName: string;
  onHome: () => void;
}

export default function SuccessScreen({ bookingId, whatsappUrl, message, regionName, onHome }: Props) {
  const [copied, setCopied] = useState(false);
  const [sentToGroup, setSentToGroup] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sendToGroup = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // clipboard may fail in some browsers; user can still copy manually
    }
    setSentToGroup(true);
    window.location.href = whatsappUrl;
  };

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
        Tekan tombol di bawah, teks booking akan tersalin otomatis dan grup WhatsApp terbuka. Tinggal tempel dan kirim.
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

      <div className="mt-4 w-full rounded-2xl border-2 border-dashed border-anj-accent/25 bg-white/60 p-4 text-left">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-anj-accent/12 text-anj-accent">
            <Users size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-anj-ink">Belum join grup WhatsApp {regionName}?</p>
            <p className="mt-1 text-xs leading-relaxed text-anj-muted">
              Join dulu agar booking Anda bisa dibaca oleh driver di kota Anda.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-anj-accent hover:underline"
            >
              <MessageCircle size={13} /> Join Grup {regionName}
            </a>
          </div>
        </div>
      </div>

      <div className="mt-5 w-full space-y-3">
        <button onClick={sendToGroup} className="btn-primary w-full">
          <Send size={18} /> Kirim ke Grup WhatsApp
        </button>
        <button onClick={copyMessage} className="btn-ghost w-full">
          {copied ? <><ClipboardCheck size={18} /> Tersalin!</> : <><Copy size={18} /> Salin Teks Saja</>}
        </button>
      </div>

      {sentToGroup && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 p-4 text-left">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-700">Teks sudah tersalin otomatis!</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-600">
              Grup WhatsApp sudah terbuka. Sekarang <span className="font-bold">tahan kolom pesan</span> di grup, pilih <span className="font-bold">Tempel</span>, lalu <span className="font-bold">Kirim</span>. Jika grup belum terbuka, tekan tombol di bawah.
            </p>
          </div>
        </div>
      )}

      {sentToGroup && (
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-3 w-full">
          <MessageCircle size={18} /> Buka Grup Lagi
        </a>
      )}

      <p className="mt-3 w-full text-left text-[11px] leading-relaxed text-anj-muted">
        WhatsApp grup tidak bisa diisi teks otomatis seperti chat personal. Itu batasan dari WhatsApp. Karena itu teks disalin otomatis ke clipboard saat Anda menekan tombol — tinggal tempel di grup.
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
