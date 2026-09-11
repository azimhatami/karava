import { useState } from 'react';
import { HiOutlineWallet, HiOutlineBanknotes } from 'react-icons/hi2';
import useWallet from './useWallet';
import useDepositWallet from './useDepositWallet';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import ResponsiveTable, { MobileDataCard } from '../../ui/ResponsiveTable';
import Modal from '../../ui/Modal';
import Pagination from '../../ui/Pagination';
import PriceField, { getPriceNumber } from '../../ui/PriceField';
import shortDate from '../../utils/shortDate';
import { toPersianNumbersWithComma } from '../../utils/toPersianNumbers';

const TX_LABELS = {
  deposit: 'شارژ آزمایشی',
  hold: 'نگه‌داشت (در انتظار)',
  release: 'واریز / آزادسازی',
  refund: 'بازگشت وجه',
};

const TX_AMOUNT_CLASS = {
  deposit: 'text-ink-mint-deep',
  hold: 'text-ink-amber-deep',
  release: 'text-ink-mint-deep',
  refund: 'text-ink-mint-deep',
};

function formatSignedAmount(type, amount) {
  const formatted = toPersianNumbersWithComma(amount || 0);
  if (type === 'hold') return `− ${formatted}`;
  return `+ ${formatted}`;
}

function WalletPanel() {
  const [page, setPage] = useState(1);
  const [depositOpen, setDepositOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [amountError, setAmountError] = useState('');
  const {
    isLoading,
    isError,
    error,
    refetch,
    wallet,
    transactions,
    pagination,
    isMock,
  } = useWallet(page);
  const { isDepositing, depositWallet } = useDepositWallet();

  const onDeposit = (event) => {
    event.preventDefault();
    const amount = getPriceNumber(amountInput);
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      setAmountError('مبلغ معتبر وارد کنید');
      return;
    }
    setAmountError('');
    depositWallet(amount, {
      onSuccess: () => {
        setDepositOpen(false);
        setAmountInput('');
        setPage(1);
      },
    });
  };

  if (isLoading) return <Loading />;
  if (isError) {
    return <QueryErrorState error={error} onRetry={refetch} />;
  }

  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="owner-panel-title">کیف پول</h2>
          <p className="owner-panel-subtitle mt-2">
            مدیریت موجودی و تراکنش‌های داخلی کارآوا
          </p>
        </div>
        {isMock ? (
          <span className="ink-chip bg-ink-amber-tint text-ink-amber-deep">
            حالت آزمایشی — بدون درگاه واقعی
          </span>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="ink-card p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] text-ink-muted">موجودی قابل‌استفاده</p>
            <HiOutlineWallet className="h-5 w-5 text-ink-mint-mid" />
          </div>
          <p className="mt-3 text-[30px] font-black tracking-[-0.015em] text-ink-text">
            {toPersianNumbersWithComma(wallet.balance || 0)}{' '}
            <span className="text-sm font-bold">تومان</span>
          </p>
          <button
            type="button"
            onClick={() => setDepositOpen(true)}
            className="ink-btn-accent mt-5"
          >
            شارژ کیف پول
          </button>
        </div>

        <div className="rounded-2xl border border-[#F3D9A8] bg-ink-amber-tint p-5">
          <p className="text-[13px] text-ink-amber-deep">موجودی در انتظار (امانت)</p>
          <p className="mt-3 text-[30px] font-black tracking-[-0.015em] text-ink-amber-deep">
            {toPersianNumbersWithComma(wallet.heldBalance || 0)}{' '}
            <span className="text-sm font-bold">تومان</span>
          </p>
          <p className="mt-3 text-[12.5px] leading-6 text-ink-amber-deep/80">
            مبلغ پیشنهادهای پذیرفته‌شده تا تکمیل پروژه نزد پلتفرم می‌ماند.
          </p>
        </div>
      </div>

      <div className="ink-card overflow-hidden">
        <div className="border-b border-ink-hair px-5 py-4">
          <h3 className="text-[15px] font-bold text-ink-text">تاریخچه تراکنش‌ها</h3>
        </div>
        {!transactions.length ? (
          <Empty
            resourceName="تراکنشی"
            title="هنوز تراکنشی ثبت نشده است"
            description="با شارژ کیف پول یا پذیرش پیشنهاد، تراکنش‌ها اینجا نمایش داده می‌شوند."
            icon={HiOutlineBanknotes}
            actionLabel="شارژ کیف پول"
            onAction={() => setDepositOpen(true)}
          />
        ) : (
          <ResponsiveTable
            columns={[
              { key: 'type', label: 'نوع' },
              { key: 'description', label: 'توضیح' },
              { key: 'amount', label: 'مبلغ' },
              { key: 'date', label: 'تاریخ' },
            ]}
            data={transactions}
            desktop={
              <ul className="divide-y divide-ink-hair">
                {transactions.map((tx) => (
                  <li
                    key={tx._id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-[#FBFAF6]"
                  >
                    <div className="min-w-0 text-right">
                      <p className="text-[14px] font-bold text-ink-text">
                        {TX_LABELS[tx.type] || tx.type}
                      </p>
                      <p className="mt-1 truncate text-[12.5px] text-ink-muted">
                        {tx.description ||
                          tx.relatedProject?.title ||
                          'بدون توضیح'}
                      </p>
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-[14px] font-black ${
                          TX_AMOUNT_CLASS[tx.type] || 'text-ink-text'
                        }`}
                      >
                        {formatSignedAmount(tx.type, tx.amount)} تومان
                      </p>
                      <p className="mt-1 text-[12px] text-ink-dim">
                        {tx.createdAt ? shortDate(tx.createdAt) : '—'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            }
            renderCard={(tx) => (
              <MobileDataCard
                className="m-3"
                title={TX_LABELS[tx.type] || tx.type}
                fields={[
                  {
                    key: 'description',
                    label: 'توضیح',
                    value:
                      tx.description ||
                      tx.relatedProject?.title ||
                      'بدون توضیح',
                  },
                  {
                    key: 'amount',
                    label: 'مبلغ',
                    value: (
                      <span
                        className={`font-black ${
                          TX_AMOUNT_CLASS[tx.type] || 'text-ink-text'
                        }`}
                      >
                        {formatSignedAmount(tx.type, tx.amount)} تومان
                      </span>
                    ),
                  },
                  {
                    key: 'date',
                    label: 'تاریخ',
                    value: tx.createdAt ? shortDate(tx.createdAt) : '—',
                  },
                ]}
              />
            )}
          />
        )}
      </div>

      {pagination.totalPages > 1 ? (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          setCurrentPage={setPage}
        />
      ) : null}

      <Modal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        title="شارژ آزمایشی کیف پول"
      >
        <form className="space-y-4" onSubmit={onDeposit}>
          <p className="rounded-xl bg-ink-amber-tint px-4 py-3 text-[12.5px] leading-6 text-ink-amber-deep">
            این شارژ شبیه‌سازی‌شده است و به درگاه پرداخت واقعی متصل نیست.
          </p>
          <PriceField
            label="مبلغ شارژ"
            name="depositAmount"
            value={amountInput}
            onChange={setAmountInput}
            required
            error={amountError}
            placeholder="مثلاً ۱۰۰,۰۰۰,۰۰۰"
          />
          <button
            type="submit"
            disabled={isDepositing}
            className="ink-btn-accent w-full"
          >
            {isDepositing ? 'در حال شارژ...' : 'تایید شارژ آزمایشی'}
          </button>
        </form>
      </Modal>
    </section>
  );
}

export default WalletPanel;
