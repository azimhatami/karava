import { toPersianNumbersWithComma } from '../utils/toPersianNumbers';

/* Tones carry meaning, matching the table status vocabulary:
 * amber = money held, ink = settled/emphasis, plain = a neutral count. */
const TONES = {
  plain: {
    card: 'border-ink-line bg-ink-card',
    label: 'text-ink-muted',
    value: 'text-ink-text',
    note: 'text-ink-dim',
    icon: 'bg-ink-well text-ink-mint-deep',
  },
  amber: {
    card: 'border-[#F3D9A8] bg-ink-amber-tint',
    label: 'text-ink-amber-deep',
    value: 'text-ink-amber-deep',
    note: 'text-ink-amber-deep/80',
    icon: 'bg-white/60 text-ink-amber-deep',
  },
  ink: {
    card: 'border-ink bg-ink',
    label: 'text-ink-dim',
    value: 'text-[#F2F6F4]',
    note: 'text-ink-mint',
    icon: 'bg-white/10 text-ink-mint',
  },
};

function StatCard({ icon: Icon, title, value, note, tone = 'plain', formatted = true }) {
  const t = TONES[tone] || TONES.plain;
  const shown =
    formatted && (typeof value === 'number' || /^\d+$/.test(String(value)))
      ? toPersianNumbersWithComma(value)
      : value;

  return (
    <div className={`flex flex-col gap-3 rounded-2xl border p-5 ${t.card}`}>
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[13px] ${t.label}`}>{title}</span>
        {Icon ? (
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.icon}`}
          >
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
        ) : null}
      </div>

      <span className={`text-[30px] font-black leading-none tracking-[-0.015em] ${t.value}`}>
        {shown}
      </span>

      {note ? <span className={`text-[12.5px] ${t.note}`}>{note}</span> : null}
    </div>
  );
}

export function StatGrid({ children, columns = 3 }) {
  return (
    <div
      className={`grid w-full gap-4 ${
        columns === 4
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {children}
    </div>
  );
}

export default StatCard;
