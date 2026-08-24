function HomeHero() {
  return (
    <section className="mx-auto flex h-auto min-h-[140px] w-full max-w-[1224px] flex-col justify-center gap-[23px] rounded-[12px] bg-[linear-gradient(90deg,#094836_0%,#608272_52.4%,#094836_100%)] p-3 text-white opacity-100 xl:h-[140px]">
      <span className="inline-flex w-fit rounded-full border border-white/30 bg-white/10 px-3 py-0.5 text-xs">
        سامانه کاریابی و مدیریت پروژه کارآوا
      </span>
      <div className="space-y-1">
        <h2 className="max-w-2xl text-xl font-bold leading-7 md:text-2xl md:leading-8">
          بهترین پروژه ها را پیدا کنید یا پروژه جدید بسازید
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-white/85">
          ارتباط مستقیم فریلنسرهای متخصص با کارفرمایان با پنل های اختصاصی و سیستم
          اعتبار سنجی شفاف
        </p>
      </div>
    </section>
  );
}

export default HomeHero;
