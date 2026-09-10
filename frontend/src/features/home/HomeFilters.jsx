import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import useCategories from '../../hooks/useCategories';
import useOutsideClick from '../../hooks/useOutsideClick';

const statusOptions = [
  { label: 'همه', value: 'ALL' },
  { label: 'باز', value: 'OPEN' },
  { label: 'بسته', value: 'CLOSED' },
];

function HomeFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { transformedCategories } = useCategories();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useOutsideClick(() => setIsCategoryOpen(false));

  const currentStatus = searchParams.get('status') || 'ALL';
  const currentCategory = searchParams.get('category') || 'ALL';

  const categoryOptions = [
    { value: 'ALL', label: 'دسته بندی(همه)' },
    ...transformedCategories,
  ];

  const currentCategoryLabel =
    categoryOptions.find((item) => item.value === currentCategory)?.label ||
    'دسته بندی(همه)';

  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const trimmed = searchValue.trim();
      if (trimmed) next.set('search', trimmed);
      else next.delete('search');
      setSearchParams(next);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'ALL') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full max-w-[704px] flex-1">
        <span className="pointer-events-none absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 opacity-100">
          <HiMagnifyingGlass className="absolute left-[2.25px] top-[2.25px] h-[19.5px] w-[19.5px] rotate-0 text-[#6E6E6E] opacity-100" />
        </span>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="جستجو در عنوان، توضیحات، یا تگ های پروژه..."
          className="h-[46px] w-full rounded-[12px] border border-[#6E6E6E] bg-white p-[10px] pr-10 text-sm text-[#111827] opacity-100 outline-none placeholder:text-[#9CA3AF] focus:border-[#6E6E6E]"
        />
      </div>

      <div ref={categoryRef} className="relative w-full sm:w-[288px]">
        <button
          type="button"
          onClick={() => setIsCategoryOpen((open) => !open)}
          className="flex h-[46px] w-full items-center justify-between rounded-[12px] border border-[#6E6E6E] bg-white p-[10px] text-sm text-[#111827]"
        >
          <span className="h-[17px] w-[104px] text-right font-['Inter'] text-[14px] font-bold leading-none tracking-normal text-[#1C2E25] opacity-100">
            {currentCategoryLabel}
          </span>
          <span className="relative h-6 w-6 shrink-0 opacity-100">
            <svg
              className="absolute left-[6px] top-[8.6px] h-[7.4px] w-3 rotate-180 opacity-100"
              viewBox="6 8 12 7.4"
              fill="#1D1B20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            </svg>
          </span>
        </button>

        {isCategoryOpen && (
          <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-[6px] border border-[#E5E7EB] bg-white shadow-lg">
            {categoryOptions.map((option) => {
              const isActive = option.value === currentCategory;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateParam('category', option.value);
                    setIsCategoryOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-right text-sm ${
                    isActive
                      ? 'bg-karava-green text-white'
                      : 'text-[#111827] hover:bg-karava-bg-subtle'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex h-[46px] w-full items-center justify-between rounded-[12px] border border-[#6E6E6E] bg-white p-[10px] sm:w-[184px]">
        {statusOptions.map((option) => {
          const isActive = option.value === currentStatus;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateParam('status', option.value)}
              className={`inline-flex shrink-0 items-center justify-center rounded-[6px] opacity-100 ${
                isActive
                  ? 'h-[26px] w-[53px] bg-[#006045] px-1.5 py-0.5'
                  : 'h-[26px] bg-transparent p-0'
              }`}
            >
              <span
                className={`h-[17px] whitespace-nowrap text-right font-['Inter'] text-[14px] font-medium leading-none tracking-normal opacity-100 ${
                  isActive ? 'text-[#F8F9FD]' : 'text-karava-gray-blue'
                }`}
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default HomeFilters;
