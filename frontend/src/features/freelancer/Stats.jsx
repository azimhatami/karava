import Stat from '../../ui/Stat';
import {
  HiOutlineViewGrid, 
  HiCurrencyDollar, 
  HiCollection 
} from "react-icons/hi";
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';


function Stats({ proposals }) {

  const numOfProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === 2);
  const balance = acceptedProposals.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  );

  return(
    <div className='grid grid-cols-3 gap-x-8'>
      <Stat 
        icon={<HiOutlineViewGrid className='w-20 h-20' />} 
        title='درخواست ها' 
        value={numOfProposals}
        color='primary'
      />
      <Stat 
        icon={<HiCurrencyDollar className='w-20 h-20' />} 
        title='پروژه های تایید شده' 
        value={acceptedProposals.length}
        color='green'
      />
      <Stat 
        icon={<HiCollection className='w-20 h-20' />} 
        title='کیف پول' 
        value={toPersianNumbersWithComma(balance)}
        color='red'
      />
    </div>
  );
}


export default Stats
