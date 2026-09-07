import { Link } from 'react-router-dom';
import { HiOutlineWallet } from 'react-icons/hi2';
import useWallet from '../features/wallet/useWallet';
import { toPersianNumbersWithComma } from '../utils/toPersianNumbers';

function WalletBalanceChip({ to }) {
  const { wallet, isLoading } = useWallet(1);

  return (
    <Link
      to={to}
      className="inline-flex h-[42px] max-w-[220px] items-center gap-2 rounded-[12px] border border-[#006045] bg-white px-3 text-sm text-[#00362E]"
      title="کیف پول"
    >
      <HiOutlineWallet className="h-5 w-5 shrink-0 text-[#006045]" />
      <span className="truncate font-bold">
        {isLoading
          ? '...'
          : `${toPersianNumbersWithComma(wallet.balance || 0)} تومان`}
      </span>
    </Link>
  );
}

export default WalletBalanceChip;
