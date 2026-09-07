import RHFSelect from '../../ui/RHFSelect';
import useChangeProposalStatus from './useChangeProposalStatus';
import Loading from '../../ui/Loading';

import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';


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

  const onSubmit = (data) => {
    const status = Number(data.status);
    if (![0, 1, 2].includes(status)) return;

    changeProposalStatus(
      { proposalId, projectId, status },
      {
        onSuccess: () => onClose(),
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
