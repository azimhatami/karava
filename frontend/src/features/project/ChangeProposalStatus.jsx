import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RHFSelect from '../../ui/RHFSelect';
import useChangeProposalStatus from './useChangeProposalStatus';
import Loading from '../../ui/Loading';
import { useForm } from 'react-hook-form';


const options = [
  {
    label: 'رد شده',
    value: 0,
  },
  {
    label: 'در انتظار تایید',
    value: 1,
  },
  {
    label: 'تایید شده',
    value: 2,
  },
];

function ChangeProposalStatus({ proposalId, onClose, currentStatus }) {
  const { id: projectId } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      status:
        currentStatus === 0 || currentStatus === 1 || currentStatus === 2
          ? String(currentStatus)
          : '',
    },
  });
  const { isUpdating, changeProposalStatus } = useChangeProposalStatus();
  const [walletBlocked, setWalletBlocked] = useState(false);

  const onSubmit = (data) => {
    const status = Number(data.status);
    if (![0, 1, 2].includes(status)) return;
    setWalletBlocked(false);

    changeProposalStatus(
      { proposalId, projectId, status },
      {
        onSuccess: () => onClose(),
        onError: (error) => {
          if (error?.response?.data?.code === 'INSUFFICIENT_WALLET_BALANCE') {
            setWalletBlocked(true);
          }
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RHFSelect
        name="status"
        label="تغییر وضعیت"
        register={register}
        required
        placeholder="انتخاب وضعیت"
        options={options}
        errors={errors}
        validationSchema={{
          required: 'وضعیت را انتخاب کنید',
          validate: (value) =>
            ['0', '1', '2'].includes(String(value)) || 'وضعیت را انتخاب کنید',
        }}
      />
      {walletBlocked ? (
        <p className="mt-4 text-sm text-[#854D0E]">
          موجودی کافی نیست.{' '}
          <Link to="/owner/wallet" className="font-bold underline">
            شارژ کیف پول
          </Link>
        </p>
      ) : null}
      <div className="mt-8">
        {isUpdating ? (
          <Loading />
        ) : (
          <button className="btn btn-primary w-full" type="submit">
            تایید
          </button>
        )}
      </div>
    </form>
  );
}


export default ChangeProposalStatus
