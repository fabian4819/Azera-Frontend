/** Isian nominal Rupiah: tampil 150.000 (tanpa 0 di depan), nilai yang dioper tetap angka. */
type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  value: number;
  onChange?: (value: number) => void;
};

const fmt = (n: number) => (n ? n.toLocaleString('id-ID') : '0');
const parse = (s: string) => Number(s.replace(/\D/g, '')) || 0;

export default function MoneyInput({ value, onChange, ...rest }: Props) {
  return <input {...rest} type="text" inputMode="numeric" value={fmt(value)} onChange={(e) => onChange?.(parse(e.target.value))} onFocus={(e) => e.currentTarget.select()} />;
}
