import { Switch } from '@headlessui/react';

function Toggle({ label, enabled, onChange }) {
  return(
    <>
      <div className='flex items-center gap-x-1'>
        <label className='text-base font-bold w-[2rem] text-center'>
          {label}
        </label>
        <Switch
          checked={enabled}
          onChange={onChange}
          className="group relative flex h-4.5 w-11 cursor-pointer rounded-full 
            \ bg-secondary-300 p-1 transition-colors duration-200 ease-in-out 
            \ focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white 
            \ data-[checked]:bg-primary-900"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block size-2.5 -translate-x-0 
              \ rounded-full bg-secondary-0 ring-0 shadow-lg transition duration-200 
              \ ease-in-out group-data-[checked]:-translate-x-7"
          />
        </Switch>
      </div>
    </>
  );
}

export default Toggle
