import { Switch } from '@headlessui/react';

function Toggle({ label, enabled, onChange }) {
  return(
    <>
      <div className='flex items-center gap-x-1'>
        <label className='w-[2.2rem] text-center text-[13px] font-bold text-ink-body'>
          {label}
        </label>
        <Switch
          checked={enabled}
          onChange={onChange}
          className="group relative flex h-4.5 w-11 cursor-pointer rounded-full 
            \ bg-[#D9D5C8] p-1 transition-colors duration-200 ease-in-out 
            \ focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white 
            \ data-[checked]:bg-ink-mint-mid"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block size-2.5 -translate-x-0 
              \ rounded-full bg-white ring-0 shadow-lg transition duration-200 
              \ ease-in-out group-data-[checked]:-translate-x-7"
          />
        </Switch>
      </div>
    </>
  );
}

export default Toggle
