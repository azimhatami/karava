import { Link } from 'react-router-dom';
import { getProfileCompletion } from '../../utils/profileCompleteness';

function ProfileCompletionCard({ user, profilePath }) {
  if (!user) return null;

  const { percent, filled, total, fields } = getProfileCompletion(user);
  const isComplete = percent >= 100;

  return (
    <section className="flex w-full flex-col gap-3 rounded-[12px] border border-[#0E6A50] bg-[#F8FFFC] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <h3 className="text-sm font-bold text-[#222020]">تکمیل پروفایل</h3>
          <p className="mt-1 text-xs text-[#6E6E6E]">
            {isComplete
              ? 'پروفایل شما کامل است و می‌توانید پیشنهاد ارسال کنید'
              : `${filled} از ${total} مورد تکمیل شده — برای اقدام‌های مهم لازم است`}
          </p>
        </div>
        <span className="text-sm font-bold text-[#006045]">{percent}٪</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[#D1D5DB]">
        <div
          className="h-full rounded-full bg-[#006045] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field) => (
          <span
            key={field.key}
            className={`rounded-[6px] border px-2 py-1 text-xs ${
              field.complete
                ? 'border-[#00D281] bg-[#ECFDF5] text-[#006045]'
                : 'border-[#E5E7EB] bg-white text-[#6E6E6E]'
            }`}
          >
            {field.label}
          </span>
        ))}
      </div>

      <div className="flex justify-end">
        <Link
          to={profilePath}
          className="text-sm font-bold text-[#006045] hover:text-[#004d37]"
        >
          {isComplete ? 'مشاهده پروفایل' : 'تکمیل پروفایل'}
        </Link>
      </div>
    </section>
  );
}

export default ProfileCompletionCard;
