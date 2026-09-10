import { useState } from 'react';
import { HiOutlineWallet, HiOutlineBanknotes } from 'react-icons/hi2';
import useWallet from './useWallet';
import useDepositWallet from './useDepositWallet';
import Loading from '../../ui/Loading';
import Empty from '../../ui/Empty';
import QueryErrorState from '../../ui/QueryErrorState';
import ResponsiveTable, { MobileDataCard } from '../../ui/ResponsiveTable';
import Modal from '../../ui/Modal';
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
  deposit: 'text-[#006045]',
  hold: 'text-[#CA8A04]',
  release: 'text-[#006045]',
  refund: 'text-[#006045]',
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
          <span className="inline-flex items-center rounded-[6px] border border-[#FACC15] bg-[#FEF9C3] px-3 py-1 text-xs font-bold text-[#854D0E]">
            حالت آزمایشی — بدون درگاه واقعی
          </span>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[12px] border border-[#006045] bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-[#6E6E6E]">موجودی قابل‌استفاده</p>
            <HiOutlineWallet className="h-5 w-5 text-[#006045]" />
          </div>
          <p className="mt-3 text-2xl font-black text-[#006045]">
            {toPersianNumbersWithComma(wallet.balance || 0)}{' '}
            <span className="text-sm font-bold">تومان</span>
          </p>
          <button
            type="button"
            onClick={() => setDepositOpen(true)}
            className="btn btn-primary mt-4 inline-flex h-10 w-auto px-4"
          >
            شارژ کیف پول
          </button>
        </div>

        <div className="rounded-[12px] border border-[#D1D5DB] bg-white p-4">
          <p className="text-sm text-[#6E6E6E]">موجودی در انتظار (escrow)</p>
          <p className="mt-3 text-2xl font-black text-[#CA8A04]">
            {toPersianNumbersWithComma(wallet.heldBalance || 0)}{' '}
            <span className="text-sm font-bold">تومان</span>
          </p>
          <p className="mt-3 text-xs leading-5 text-[#6E6E6E]">
            مبلغ پیشنهادهای پذیرفته‌شده تا تکمیل پروژه نزد پلتفرم می‌ماند.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-[#245A49] bg-white">
        <div className="border-b border-[#E5E7EB] px-4 py-3">
          <h3 className="text-sm font-bold text-[#222020]">تاریخچه تراکنش‌ها</h3>
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
              <ul className="divide-y divide-[#E5E7EB]">
                {transactions.map((tx) => (
                  <li
                    key={tx._id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0 text-right">
                      <p className="text-sm font-bold text-[#222020]">
                        {TX_LABELS[tx.type] || tx.type}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#6E6E6E]">
                        {tx.description ||
                          tx.relatedProject?.title ||
                          'بدون توضیح'}
                      </p>
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-sm font-bold ${
                          TX_AMOUNT_CLASS[tx.type] || 'text-[#222020]'
                        }`}
                      >
                        {formatSignedAmount(tx.type, tx.amount)} تومان
                      </p>
                      <p className="mt-1 text-xs text-[#9CA3AF]">
                        {tx.createdAt ? shortDate(tx.createdAt) : '—'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            }
            renderCard={(tx) => (
              <MobileDataCard
                className="m-3 border-[#D1D5DB]"
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
                        className={`font-bold ${
                          TX_AMOUNT_CLASS[tx.type] || 'text-[#222020]'
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
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 text-sm disabled:opacity-40"
          >
            قبلی
          </button>
          <span className="text-sm text-[#6E6E6E]">
            صفحه {pagination.page} از {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 text-sm disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      ) : null}

      <Modal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        title="شارژ آزمایشی کیف پول"
      >
        <form className="space-y-4" onSubmit={onDeposit}>
          <p className="rounded-[8px] bg-[#FEF9C3] px-3 py-2 text-xs leading-5 text-[#854D0E]">
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
            className="karava-form-submit"
          >
            {isDepositing ? 'در حال شارژ...' : 'تایید شارژ آزمایشی'}
          </button>
        </form>
      </Modal>
    </section>
  );
}

export default WalletPanel;
