import { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../ui/TextField';
import PriceField, { getPriceNumber } from '../../ui/PriceField';
import Loading from '../../ui/Loading';
import useCreateProposal from './useCreateProposal';
import useUser from '../authentication/useUser';
import { showProfileIncompleteModal } from '../profile/ProfileIncompleteHost';
import { DURATION_UNIT_OPTIONS } from '../../utils/formatProposalDuration';
import {
  digitsOnly,
  numericFieldOptions,
  parseLocalizedNumber,
} from '../../utils/normalizeDigits';
import {
  ACTION_TYPES,
  getProfileIncompletePayload,
  isProfileCompleteForAction,
  isProfileIncompleteError,
} from '../../utils/profileCompleteness';

function getProfilePath(role) {
  if (role === 'OWNER') return '/owner/profile';
  if (role === 'ADMIN') return '/admin/profile';
  return '/freelancer/profile';
}

function CreateProposal({ onClose, projectId }) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: '',
      duration: '',
      durationUnit: 'day',
    },
  });
  const { isCreating, createProposal } = useCreateProposal();
  const [priceDisplay, setPriceDisplay] = useState('');
  const [priceError, setPriceError] = useState('');

  const durationRegister = register(
    'duration',
    numericFieldOptions({
      required: 'مدت زمان ضروری است',
      validate: (value) =>
        parseLocalizedNumber(value) >= 1 || 'حداقل ۱ وارد کنید',
    }),
  );

  const openIncomplete = (payload) => {
    showProfileIncompleteModal({
      ...payload,
      profilePath: getProfilePath(user?.role),
    });
    onClose?.();
  };

  const onSubmit = (data) => {
    const price = getPriceNumber(priceDisplay);
    if (!price || Number.isNaN(price) || price <= 0) {
      setPriceError('قیمت ضروری است');
      return;
    }
    setPriceError('');

    const localCheck = isProfileCompleteForAction(
      user,
      ACTION_TYPES.SEND_PROPOSAL,
    );

    if (!localCheck.complete) {
      openIncomplete({
        message: 'برای ارسال پیشنهاد باید ابتدا پروفایل خود را تکمیل کنید',
        missingFields: localCheck.missingFields,
      });
      return;
    }

    createProposal(
      {
        description: data.description,
        duration: parseLocalizedNumber(data.duration),
        durationUnit: data.durationUnit || 'day',
        price,
        projectId,
      },
      {
        onSuccess: () => onClose(),
        onError: (error) => {
          if (!isProfileIncompleteError(error)) return;
          openIncomplete(getProfileIncompletePayload(error));
        },
      },
    );
  };

  return (
    <div>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="توضیحات"
          name="description"
          register={register}
          required
          validationSchema={{
            required: 'توضیحات ضروری است',
            minLength: {
              value: 10,
              message: 'حداقل ۱۰ کاراکتر وارد کنید',
            },
          }}
          errors={errors}
        />

        <PriceField
          required
          value={priceDisplay}
          onChange={(value) => {
            setPriceDisplay(value);
            if (priceError) setPriceError('');
          }}
          error={priceError}
        />

        <div className="karava-form-field">
          <label htmlFor="duration" className="karava-form-label">
            مدت زمان
            <span className="text-karava-red"> *</span>
          </label>
          <div className="grid grid-cols-[1fr_120px] gap-2">
            <input
              id="duration"
              type="text"
              inputMode="numeric"
              placeholder="مثلاً ۱۰"
              className="karava-form-input"
              {...durationRegister}
              onChange={(event) => {
                event.target.value = digitsOnly(event.target.value);
                durationRegister.onChange(event);
              }}
            />
            <select
              className="karava-form-input px-3"
              {...register('durationUnit', {
                required: 'واحد مدت زمان ضروری است',
              })}
            >
              {DURATION_UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {errors.duration ? (
            <span className="mt-1 block text-right text-xs text-karava-red">
              {errors.duration.message}
            </span>
          ) : null}
        </div>

        <div>
          {isCreating ? (
            <Loading />
          ) : (
            <button type="submit" className="karava-form-submit mt-2">
              تایید و ذخیره
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateProposal;
