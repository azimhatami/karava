import { Link } from 'react-router-dom';
import Modal from './Modal';

function ProfileIncompleteModal({
  open,
  onClose,
  message,
  missingFields = [],
  profilePath = '/complete-profile',
}) {
  return (
    <Modal open={open} onClose={onClose} title="تکمیل پروفایل لازم است">
      <div className="flex flex-col gap-5 text-right">
        <p className="text-sm leading-7 text-[#374151]">
          {message ||
            'برای انجام این عملیات باید ابتدا پروفایل خود را تکمیل کنید.'}
        </p>

        {missingFields.length > 0 ? (
          <div className="rounded-[8px] border border-[#F59E0B] bg-[#FFFBEB] p-3">
            <p className="mb-2 text-xs font-bold text-[#B45309]">
              فیلدهای ناقص:
            </p>
            <ul className="flex flex-col gap-1.5">
              {missingFields.map((field) => (
                <li
                  key={field.key || field}
                  className="text-sm text-[#92400E]"
                >
                  • {field.label || field}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-[42px] items-center justify-center rounded-[6px] border border-[#5C6E66] bg-white px-4 text-sm text-[#0E1F1A] transition-colors hover:bg-[#F7F5EF]"
          >
            بعداً
          </button>
          <Link
            to={profilePath}
            onClick={onClose}
            className="inline-flex h-[42px] items-center justify-center rounded-[6px] bg-[#1E7C50] px-4 text-sm font-bold text-white transition-colors hover:bg-[#004d37]"
          >
            تکمیل پروفایل
          </Link>
        </div>
      </div>
    </Modal>
  );
}

export default ProfileIncompleteModal;
