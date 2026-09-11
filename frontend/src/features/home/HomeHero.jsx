import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';

function compactToman(value) {
  if (!value) return '۰';
  if (value >= 1_000_000_000)
    return `${toPersianNumbersWithComma(Math.round(value / 1_000_000_000))} میلیارد`;
  if (value >= 1_000_000)
    return `${toPersianNumbersWithComma(Math.round(value / 1_000_000))} میلیون`;
  return toPersianNumbersWithComma(value);
}

function HomeHero({ openCount = 0, categoryCount = 0, totalBudget = 0 }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || ''
  );

  // Debounced write-through to the URL; the project query reads from there.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(window.location.search);
      const trimmed = searchValue.trim();
      if (trimmed) next.set('search', trimmed);
      else next.delete('search');
      setSearchParams(next, { replace: true });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const stats = [
    {
      label: 'پروژه باز',
      value: toPersianNumbersWithComma(openCount),
      note: 'آمادهٔ دریافت پیشنهاد',
      noteClass: 'text-ink-mint',
    },
    {
      label: 'دسته‌بندی تخصصی',
      value: toPersianNumbersWithComma(categoryCount),
      note: 'از وب تا تولید محتوا',
      noteClass: 'text-ink-dim',
    },
    {
      label: 'مجموع بودجه',
      value: compactToman(totalBudget),
      note: 'تومان در پروژه‌های این فهرست',
      noteClass: 'text-ink-dim',
    },
  ];

  return (
    <section className="grid grid-cols-1 items-end gap-10 pb-14 pt-2 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-16">
      <div className="flex flex-col gap-6 lg:gap-7">
        <div className="flex items-center gap-2.5">
          <span className="h-[7px] w-[7px] rounded-full bg-ink-mint" />
          <span className="text-[13px] text-ink-dim">بازار کار پروژه‌ای ایران</span>
        </div>

        <h1 className="text-[38px] font-black leading-[1.16] tracking-[-0.02em] text-[#F2F6F4] md:text-[52px] xl:text-[60px]">
          کار درست را
          <br />
          <span className="text-ink-mint">به آدمِ درست</span> بسپارید
        </h1>

        <p className="max-w-[520px] text-[15px] leading-[2] text-ink-dim md:text-base">
          پروژه را ثبت کنید، پیشنهادها را کنار هم ببینید و بودجه تا تحویل کار نزد
          کارآوا امانت می‌ماند.
        </p>

        <div className="flex max-w-[560px] items-center gap-2.5 rounded-[14px] border border-white/10 bg-ink-raised p-2">
          <HiMagnifyingGlass className="mr-3 h-[19px] w-[19px] shrink-0 text-ink-dim" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="مثلاً: طراحی لندینگ، اپلیکیشن رزرو…"
            aria-label="جستجوی پروژه"
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[15px] text-[#F2F6F4] outline-none placeholder:text-ink-dim focus:ring-0"
          />
          <span className="hidden h-11 shrink-0 items-center rounded-[10px] bg-ink-mint px-6 text-sm font-bold text-ink sm:inline-flex">
            جستجو
          </span>
        </div>
      </div>

      <dl className="flex flex-col gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between gap-4 bg-ink-raised px-6 py-5"
          >
            <div className="flex flex-col gap-1.5">
              <dt className="text-[13px] text-ink-dim">{stat.label}</dt>
              <dd className={`text-[13px] ${stat.noteClass}`}>{stat.note}</dd>
            </div>
            <span className="text-[28px] font-black tracking-[-0.01em] text-[#F2F6F4] xl:text-[34px]">
              {stat.value}
            </span>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default HomeHero;
