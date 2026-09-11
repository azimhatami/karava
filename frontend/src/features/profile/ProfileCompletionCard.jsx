import { Link } from 'react-router-dom';
import { getProfileCompletion } from '../../utils/profileCompleteness';

function ProfileCompletionCard({ user, profilePath }) {
  if (!user) return null;

  const { percent, filled, total, fields } = getProfileCompletion(user);
  const isComplete = percent >= 100;

  return (
    <section className="ink-card flex w-full flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-right">
          <h3 className="text-[15px] font-bold text-ink-text">تکمیل پروفایل</h3>
          <p className="mt-1.5 text-[13px] text-ink-muted">
            {isComplete
              ? 'پروفایل شما کامل است و می‌توانید پیشنهاد ارسال کنید'
              : `${filled} از ${total} مورد تکمیل شده — برای اقدام‌های مهم لازم است`}
          </p>
        </div>
        <span className="text-lg font-black text-ink-mint-deep">{percent}٪</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-well">
        <div
          className="h-full rounded-full bg-ink-mint-mid transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {fields.map((field) => (
          <span
            key={field.key}
            className={`rounded-full border px-3 py-1 text-[12px] ${
              field.complete
                ? 'border-transparent bg-ink-mint-tint text-ink-mint-deep'
                : 'border-ink-line bg-ink-card text-ink-dim'
            }`}
          >
            {field.label}
          </span>
        ))}
      </div>

      <div className="flex justify-end">
        <Link
          to={profilePath}
          className="text-[13px] font-bold text-ink-mint-mid transition-colors hover:text-ink-mint-deep"
        >
          {isComplete ? 'مشاهده پروفایل' : 'تکمیل پروفایل'}
        </Link>
      </div>
    </section>
  );
}

export default ProfileCompletionCard;
