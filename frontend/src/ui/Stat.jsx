import { toPersianNumbers } from '../utils/toPersianNumbers';


const colors = {
  primary: 'bg-primary-100/40 text-primary-700',
  green: 'bg-green-100/50 text-green-700',
  red: 'bg-red-100/50 text-red-700',
};

function Stat({icon, title, value, color}) {
  return(
    <div className={`col-span-1 grid grid-rows-2 grid-cols-[6.4rem_1fr] bg-secondary-0 p-4 rounded-lg gap-x-4 ${colors[color]}`}>
      <div className={`row-span-2 flex items-center justify-center aspect-square rounded-full ${colors[color]}`}>
        {icon}
      </div>
      <h5 className='font-bold text-secondary-500 text-lg self-center'>{title}</h5>
      <p className='font-bold text-secondary-900 text-xl'>
        {toPersianNumbers(value)}
      </p>
    </div>
  );
}

export default Stat
