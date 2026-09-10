import RHFSelect from '../../../ui/RHFSelect';
import useChangeUserStatus from './useChangeUserStatus';
import Loading from '../../../ui/Loading';

import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

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

function ChangeProposalStatus({ userId, onClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isUpdating, changeUserStatus } = useChangeUserStatus();
  const queryClient = useQueryClient();

  const onSubmit = (data) => {
    changeUserStatus(
      { userId, data },
      {
        onSuccess: () => {
          onClose();
          queryClient.invalidateQueries({ queryKey: ['users'] });
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
        options={options}
        errors={errors}
        validationSchema={{
          required: 'انتخاب وضعیت ضروری است',
        }}
      />
      <div className="mt-8">
        {isUpdating ? (
          <Loading />
        ) : (
          <button className="karava-form-submit" type="submit">
            تایید
          </button>
        )}
      </div>
    </form>
  );
}

export default ChangeProposalStatus;
