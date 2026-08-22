import { useState } from 'react';
import { User, Phone, Calendar, Clock, Users, StickyNote, AlertCircle } from 'lucide-react';
import type { CustomerData } from '@/utils/booking';
import { isValidWhatsAppNumber } from '@/utils/format';

interface Props {
  value: CustomerData;
  onChange: (v: CustomerData) => void;
}

export default function CustomerForm({ value, onChange }: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = <K extends keyof CustomerData>(k: K, v: CustomerData[K]) => {
    onChange({ ...value, [k]: v });
  };
  const blur = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const waError = touched.whatsapp && value.whatsapp && !isValidWhatsAppNumber(value.whatsapp);

  return (
    <div className="card p-5">
      <p className="section-eyebrow">Data Pemesan</p>
      <div className="mt-4 space-y-4">
        <div>
          <label className="field-label">Nama Lengkap</label>
          <div className="relative">
            <User size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
            <input
              value={value.name}
              onChange={(e) => set('name', e.target.value)}
              onBlur={() => blur('name')}
              placeholder="Nama lengkap Anda"
              className="field-input pl-11"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Nomor WhatsApp</label>
          <div className="relative">
            <Phone size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
            <input
              value={value.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              onBlur={() => blur('whatsapp')}
              inputMode="tel"
              placeholder="08xxxxxxxxxx"
              className={`field-input pl-11 ${waError ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : ''}`}
            />
          </div>
          {waError && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
              <AlertCircle size={13} /> Format nomor WhatsApp tidak valid.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Tanggal Perjalanan</label>
            <div className="relative">
              <Calendar size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
              <input
                type="date"
                value={value.date}
                onChange={(e) => set('date', e.target.value)}
                className="field-input pl-11"
              />
            </div>
          </div>
          <div>
            <label className="field-label">Jam Penjemputan</label>
            <div className="relative">
              <Clock size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
              <input
                type="time"
                value={value.time}
                onChange={(e) => set('time', e.target.value)}
                className="field-input pl-11"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="field-label">Jumlah Penumpang</label>
          <div className="relative">
            <Users size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-anj-muted" />
            <select
              value={value.passengers}
              onChange={(e) => set('passengers', Number(e.target.value))}
              className="field-input pl-11 appearance-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n} orang</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="field-label">Catatan Tambahan</label>
          <div className="relative">
            <StickyNote size={18} className="pointer-events-none absolute left-3.5 top-4 text-anj-muted" />
            <textarea
              value={value.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              placeholder="Contoh: Membawa koper, membutuhkan bantuan saat naik kendaraan, dll."
              className="field-input pl-11 pt-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
