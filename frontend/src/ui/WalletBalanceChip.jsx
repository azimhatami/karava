import { Link } from 'react-router-dom';
import { HiOutlineWallet } from 'react-icons/hi2';
import useWallet from '../features/wallet/useWallet';
import { toPersianNumbersWithComma } from '../utils/toPersianNumbers';

function WalletBalanceChip({ to }) {
  const { wallet, isLoading } = useWallet(1);

  return (
    <Link
      to={to}
      className="hidden h-10 max-w-[220px] items-center gap-2 rounded-[10px] border border-ink-line px-3 text-[13px] text-ink-text transition-colors hover:bg-ink-well sm:inline-flex"
      title="کیف پول"
    >
      <HiOutlineWallet className="h-[18px] w-[18px] shrink-0 text-ink-mint-mid" />
      <span className="truncate font-bold">
        {isLoading
          ? '…'
          : `${toPersianNumbersWithComma(wallet.balance || 0)} تومان`}
      </span>
    </Link>
  );
}

export default WalletBalanceChip;
