import { Send } from 'lucide-react';
import { formatRupiah } from '@/utils/format';

interface Props {
  total: number | null;
  canSubmit: boolean;
  onSubmit: () => void;
}

export default function StickyCTA({ total, canSubmit, onSubmit }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/90 px-4 py-3 backdrop-blur-md md:hidden">
      <button
        disabled={!canSubmit}
        onClick={onSubmit}
        className="btn-primary w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Send size={18} />
          {canSubmit ? 'Kirim Booking' : 'Lengkapi Data'}
        </span>
        {total != null && canSubmit && <span className="text-sm font-extrabold">{formatRupiah(total)}</span>}
      </button>
    </div>
  );
}
