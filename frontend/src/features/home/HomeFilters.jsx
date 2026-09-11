import { useSearchParams } from 'react-router-dom';
import useCategories from '../../hooks/useCategories';

const statusOptions = [
  { label: 'همه', value: 'ALL' },
  { label: 'باز', value: 'OPEN' },
  { label: 'بسته', value: 'CLOSED' },
];

function HomeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { transformedCategories } = useCategories();

  const currentStatus = searchParams.get('status') || 'ALL';
  const currentCategory = searchParams.get('category') || 'ALL';

  const categoryOptions = [
    { value: 'ALL', label: 'همه دسته‌ها' },
    ...transformedCategories,
  ];

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <div className="-mt-7 flex flex-col gap-5 rounded-2xl border border-ink-line bg-ink-card p-5 shadow-[0_10px_30px_rgba(7,20,17,0.06)] lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div
        className="flex flex-wrap items-center gap-2.5"
        role="group"
        aria-label="فیلتر دسته‌بندی"
      >
        {categoryOptions.map((option) => {
          const isActive = option.value === currentCategory;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => updateParam('category', option.value)}
              className={`flex h-[38px] items-center rounded-full border px-4 text-[13.5px] font-medium transition-colors ${
                isActive
                  ? 'border-ink-raised bg-ink-raised text-[#F2F6F4]'
                  : 'border-ink-line bg-ink-card text-ink-muted hover:border-ink-dim'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-4">
        <div
          className="flex shrink-0 items-center gap-1 rounded-xl bg-ink-well p-1"
          role="group"
          aria-label="فیلتر وضعیت"
        >
          {statusOptions.map((option) => {
            const isActive = option.value === currentStatus;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => updateParam('status', option.value)}
                className={`flex h-9 items-center rounded-[9px] px-[18px] text-[13.5px] font-bold transition-colors ${
                  isActive
                    ? 'bg-ink-card text-ink-text shadow-sm'
                    : 'bg-transparent text-ink-muted hover:text-ink-text'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomeFilters;
