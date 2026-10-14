import { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { Calendar } from 'lucide-react';
import 'react-day-picker/style.css';

interface DatePickerProps {
  value: string; // 'yyyy-MM-dd'
  onChange: (value: string) => void;
  max?: Date;
  placeholder?: string;
  style?: React.CSSProperties;
}

const toDate = (value: string) => {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const toValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const formatDisplay = (date: Date) =>
  date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

export default function DatePicker({ value, onChange, max, placeholder, style }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selected = toDate(value);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          ...style,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left', cursor: 'pointer',
          color: selected ? '#191c20' : '#8a8a99',
        }}
      >
        {selected ? formatDisplay(selected) : (placeholder || 'Pilih tanggal')}
        <Calendar size={16} color="#6728e4" style={{ flexShrink: 0, marginLeft: '8px' }} />
      </button>
      {open && (
        <div
          style={{
            position: 'absolute', zIndex: 20, top: 'calc(100% + 6px)', left: 0,
            background: 'white', borderRadius: '16px', boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
            border: '1px solid #e1e0ff', padding: '12px',
            ['--rdp-accent-color' as string]: '#6728e4',
            ['--rdp-accent-background-color' as string]: '#f2effe',
            ['--rdp-today-color' as string]: '#6728e4',
          }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(toValue(date));
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={new Date(1950, 0)}
            endMonth={max || new Date()}
            disabled={max ? { after: max } : undefined}
            defaultMonth={selected || new Date(2000, 0)}
            style={{ fontFamily: 'var(--font-display)' }}
          />
        </div>
      )}
    </div>
  );
}
