import { useState } from 'react';
import { HiPlus, HiXMark, HiTag } from 'react-icons/hi2';

function KaravaTagsInput({ tags, onChange, label = 'تگ ها', placeholder = 'افزودن تگ(مثلا figma)' }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput('');
  };

  const removeTag = (tag) => {
    onChange(tags.filter((item) => item !== tag));
  };

  return (
    <div className="karava-form-field">
      <label className="karava-form-label">{label}</label>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="karava-form-input min-w-0 flex-1"
        />
        <button
          type="button"
          onClick={addTag}
          className="inline-flex shrink-0 items-center gap-1 rounded-[6px] bg-karava-bg-subtle px-3 py-3 text-sm font-medium text-karava-green transition-colors hover:bg-[#E5E7EB]"
        >
          <span>افزودن</span>
          <HiPlus className="h-4 w-4" />
        </button>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap justify-end gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-karava-green px-2.5 py-1 text-xs text-white"
            >
              <HiTag className="h-3 w-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`حذف ${tag}`}
                className="rounded-full p-0.5 transition-colors hover:bg-white/20"
              >
                <HiXMark className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default KaravaTagsInput;
