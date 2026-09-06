import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineWallet,
} from 'react-icons/hi2';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';

function StatCard({ icon: Icon, title, value, valueSuffix }) {
  return (
    <div className="flex h-auto min-h-[68px] w-[288px] rotate-0 flex-col justify-center gap-2 rounded-[6px] border border-[#006045] bg-white p-2.5 opacity-100">
      <div className="flex h-[28px] w-[266px] rotate-0 items-center justify-between opacity-100">
        <p className="h-[19px] w-[139px] rotate-0 whitespace-nowrap text-right font-['Inter'] text-base font-bold leading-none tracking-normal text-black opacity-100">
          {title}
        </p>
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
          <Icon
            className="h-5 w-5 rotate-0 text-[#006045] opacity-100"
            strokeWidth={2}
            aria-hidden
          />
        </div>
      </div>
      <p className="flex h-[19px] w-[266px] rotate-0 items-center justify-start gap-6 opacity-100">
        <span className="h-[19px] w-[95px] rotate-0 text-right font-['Inter'] text-base font-bold leading-none tracking-normal text-[#222020] opacity-100">
          {value}
        </span>
        {valueSuffix ? (
          <span className="text-right font-['Inter'] text-base font-bold leading-none text-black">
            {valueSuffix}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function FreelancerStats({ proposals = [] }) {
  const numOfProposals = proposals.length;
  const acceptedProposals = proposals.filter((p) => p.status === 2);
  const balance = acceptedProposals.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  );

  return (
    <div className="flex w-full flex-wrap justify-between gap-4">
      <StatCard
        icon={HiOutlineDocumentText}
        title="درخواست ها"
        value={numOfProposals}
      />
      <StatCard
        icon={HiOutlineCheckCircle}
        title="پروژه های تایید شده"
        value={acceptedProposals.length}
      />
      <StatCard
        icon={HiOutlineWallet}
        title="کیف پول"
        value={toPersianNumbersWithComma(balance)}
        valueSuffix="تومان"
      />
    </div>
  );
}

export default FreelancerStats;
