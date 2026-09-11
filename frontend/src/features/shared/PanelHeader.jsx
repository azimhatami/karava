import { Link } from 'react-router-dom';
import useUser from '../authentication/useUser';
import WalletBalanceChip from '../../ui/WalletBalanceChip';
import PanelMenuButton from './PanelMenuButton';

/**
 * One header for all three panels. `walletTo` is omitted for admin, which has
 * no wallet.
 */
function PanelHeader({ roleTitle, walletTo }) {
  const { user } = useUser();

  return (
    <header className="border-b border-ink-line bg-ink-card">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 md:px-8 xl:px-10">
        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <PanelMenuButton />
          <Link to="/" className="flex items-baseline gap-2.5">
            <span className="font-['Sora',_sans-serif] text-[17px] font-bold tracking-[0.14em] text-ink-mint-mid">
              KARAVA
            </span>
            <span className="hidden text-lg font-black text-ink-text sm:inline">
              کارآوا
            </span>
          </Link>
          <span className="hidden h-6 w-px bg-ink-line md:block" />
          <span className="hidden text-[13px] text-ink-muted md:inline">
            پنل {roleTitle}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2.5">
          {walletTo ? <WalletBalanceChip to={walletTo} /> : null}
          <span className="flex h-10 items-center gap-2.5 rounded-[10px] border border-ink-line px-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-raised text-[11px] font-bold text-ink-mint">
              {(user?.name || 'ک').trim().charAt(0)}
            </span>
            <span className="max-w-[120px] truncate text-[13px] font-medium text-ink-text">
              {user?.name || 'کاربر'}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}

export default PanelHeader;
