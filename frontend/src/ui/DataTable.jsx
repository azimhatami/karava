import { toPersianNumbersWithComma } from '../utils/toPersianNumbers';

/* ────────────────── status vocabulary ──────────────────
 * One source of truth for every status pill in the panels, so a colour
 * always means the same thing: mint = live/good, amber = money held or
 * halted, slate = finished, neutral = waiting.
 */
export const STATUS_STYLES = {
  open: { label: 'باز', chip: 'bg-ink-mint-tint text-ink-mint-deep', dot: 'bg-ink-mint' },
  closed: { label: 'بسته', chip: 'bg-ink-amber-tint text-ink-amber-deep', dot: 'bg-ink-amber' },
  completed: { label: 'تکمیل‌شده', chip: 'bg-[#EEF1F5] text-[#46586B]', dot: 'bg-[#8AA0B6]' },
  pending: { label: 'در انتظار', chip: 'bg-ink-well text-ink-muted', dot: 'bg-[#A9B3AE]' },
  accepted: { label: 'پذیرفته‌شده', chip: 'bg-ink-mint-tint text-ink-mint-deep', dot: 'bg-ink-mint' },
  rejected: { label: 'رد شده', chip: 'bg-ink-amber-tint text-ink-amber-deep', dot: 'bg-ink-amber' },
};

export function StatusChip({ status, label, size = 'md' }) {
  const meta = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const small = size === 'sm';

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full font-bold ${meta.chip} ${
        small ? 'h-[22px] px-2.5 text-[11px]' : 'h-7 px-3 text-[12.5px]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {label || meta.label}
    </span>
  );
}

/* ────────────────── escrow ──────────────────
 * The platform's whole promise, and until now invisible in the panels.
 */
const ESCROW = {
  held: { label: 'در امانت', dot: 'bg-ink-amber', text: 'text-ink-amber-deep' },
  released: { label: 'آزاد شد', dot: 'bg-ink-mint', text: 'text-ink-mint-deep' },
  refunded: { label: 'بازگردانده شد', dot: 'bg-[#8AA0B6]', text: 'text-[#46586B]' },
  none: { label: 'بدون امانت', dot: 'bg-[#CFCBBE]', text: 'text-ink-dim' },
};

export function EscrowCell({ status }) {
  const meta = ESCROW[status] || ESCROW.none;
  return (
    <span className={`flex items-center gap-2 text-[12.5px] ${meta.text}`}>
      <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

/* ────────────────── cells ────────────────── */

export function Money({ amount, unit = 'تومان' }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="text-[15px] font-black tracking-[-0.01em] text-ink-text">
        {toPersianNumbersWithComma(amount || 0)}
      </span>
      <span className="text-[11.5px] text-ink-dim">{unit}</span>
    </span>
  );
}

export function Avatar({ name, className = '' }) {
  return (
    <span
      className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-ink-raised text-[13px] font-bold text-ink-mint ${className}`}
    >
      {(name || '؟').trim().charAt(0)}
    </span>
  );
}

/**
 * The design-C primary cell: one strong title with everything secondary
 * folded into a muted meta line underneath, which is what lets the table
 * drop from eight columns to four.
 */
export function PrimaryCell({ title, avatarName, status, statusLabel, meta = [] }) {
  const parts = meta.filter(Boolean);

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={avatarName || title} />
      <div className="min-w-0">
        <div className="mb-1 truncate text-[15px] font-bold text-ink-text">
          {title}
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-dim">
          {status ? <StatusChip status={status} label={statusLabel} size="sm" /> : null}
          {parts.map((part, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 || status ? (
                <span className="inline-block h-[3px] w-[3px] rounded-full bg-[#CFCBBE]" />
              ) : null}
              <span className="truncate">{part}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IconAction({ icon: Icon, label, onClick, to, tone = 'default', as: As }) {
  const className = `flex h-9 w-9 items-center justify-center rounded-[9px] border transition-colors ${
    tone === 'danger'
      ? 'border-[#F0C2CE] text-[#C9093D] hover:bg-[#FDF2F5]'
      : 'border-ink-line text-ink-muted hover:bg-ink-well hover:text-ink-text'
  }`;

  if (As) {
    return (
      <As to={to} aria-label={label} title={label} className={className}>
        <Icon className="h-[17px] w-[17px]" />
      </As>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className={className}>
      <Icon className="h-[17px] w-[17px]" />
    </button>
  );
}

/* ────────────────── shell ────────────────── */

/** Desktop grid table: a header strip plus rows that share one grid template. */
export function GridTable({ columns, children, minWidth = 880 }) {
  const template = columns.map((c) => c.width).join(' ');

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-ink-line bg-ink-card">
      <div style={{ minWidth }}>
        <div
          className="grid gap-5 border-b border-ink-hair bg-[#FBFAF6] px-[22px] py-3"
          style={{ gridTemplateColumns: template }}
        >
          {columns.map((column) => (
            <span
              key={column.key}
              className={`text-[12.5px] text-ink-dim ${column.align === 'end' ? 'text-left' : ''}`}
            >
              {column.label}
            </span>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export function GridRow({ columns, children }) {
  const template = columns.map((c) => c.width).join(' ');

  return (
    <div
      className="grid items-center gap-5 border-b border-[#F3F1EA] px-[22px] py-4 transition-colors last:border-b-0 hover:bg-[#FBFAF6]"
      style={{ gridTemplateColumns: template }}
    >
      {children}
    </div>
  );
}

/**
 * Mobile card — the panels' tables collapse to these below `md`.
 * Same information hierarchy as the desktop row, stacked.
 */
export function DataCard({ title, avatarName, status, statusLabel, meta = [], stats = [], actions }) {
  return (
    <article className="rounded-2xl border border-ink-line bg-ink-card p-4">
      <div className="mb-3.5 flex items-start gap-3">
        <Avatar name={avatarName || title} />
        <div className="min-w-0 flex-1">
          <h4 className="mb-1.5 text-[15px] font-bold leading-6 text-ink-text">
            {title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-dim">
            {status ? <StatusChip status={status} label={statusLabel} size="sm" /> : null}
            {meta.filter(Boolean).map((part, index) => (
              <span key={index}>{part}</span>
            ))}
          </div>
        </div>
      </div>

      {stats.length ? (
        <dl className="mb-3.5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-hair bg-ink-hair">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-ink-card px-3.5 py-3">
              <dt className="mb-1 text-[11.5px] text-ink-dim">{stat.label}</dt>
              <dd className="text-[13.5px] font-bold text-ink-text">{stat.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {actions ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-ink-hair pt-3.5">
          {actions}
        </div>
      ) : null}
    </article>
  );
}
