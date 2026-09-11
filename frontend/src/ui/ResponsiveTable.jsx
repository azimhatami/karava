import { Fragment } from 'react';

/**
 * Shared mobile card chrome for table rows.
 * Keeps status badges/links styled by the caller; only layout is vertical.
 */
export function MobileDataCard({ title, fields = [], actions, children, className = '' }) {
  return (
    <article
      className={`rounded-2xl border border-ink-line bg-ink-card p-4 text-right ${className}`}
    >
      {title ? (
        <h4 className="mb-3 text-[15px] font-bold leading-6 text-ink-text">{title}</h4>
      ) : null}

      {fields.length ? (
        <dl className="space-y-2.5">
          {fields.map((field) => (
            <div
              key={field.key || field.label}
              className="flex flex-col gap-1 border-b border-ink-hair pb-2.5 last:border-b-0 last:pb-0"
            >
              <dt className="text-xs text-ink-dim">{field.label}</dt>
              <dd className="min-w-0 text-sm text-ink-body">
                {field.value ?? '—'}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {actions ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-hair pt-3">
          {actions}
        </div>
      ) : null}

      {children}
    </article>
  );
}

/**
 * Shows desktop table/grid above `md`, and card list below `md`.
 *
 * @param {Array<{ key: string, label: string }>} [columns] - column metadata (available to renderCard)
 * @param {Array} data - row data
 * @param {(row, index) => string|number} [getRowKey]
 * @param {React.ReactNode} desktop - unchanged desktop table/grid markup
 * @param {(row, index, columns) => React.ReactNode} renderCard - mobile card renderer
 * @param {string} [className]
 */
function ResponsiveTable({
  columns = [],
  data = [],
  getRowKey = (row) => row._id,
  desktop,
  renderCard,
  className = '',
}) {
  return (
    <div className={className}>
      <div className="hidden md:block">{desktop}</div>
      <div className="flex flex-col gap-3 md:hidden">
        {data.map((row, index) => (
          <Fragment key={getRowKey(row, index)}>
            {renderCard(row, index, columns)}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ResponsiveTable;
