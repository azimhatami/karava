import { toPersianNumbers } from '../utils/toPersianNumbers';

const MAX_VISIBLE_TAGS = 3;

function TagChip({ label }) {
  return (
    <span className="inline-flex h-7 max-w-full shrink-0 items-center truncate rounded-lg border border-[#BFDBFE] bg-[#EAF2FF] px-2 text-[13px] font-medium leading-none text-[#2563EB]">
      {label}
    </span>
  );
}

function ProjectTags({ tags = [], className = '' }) {
  if (!tags.length) return null;

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const overflowCount = tags.length - MAX_VISIBLE_TAGS;

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 px-1 ${className}`}
    >
      {visibleTags.map((tag) => (
        <TagChip key={tag} label={tag} />
      ))}
      {overflowCount > 0 ? (
        <TagChip label={`+${toPersianNumbers(overflowCount)}`} />
      ) : null}
    </div>
  );
}

export default ProjectTags;
