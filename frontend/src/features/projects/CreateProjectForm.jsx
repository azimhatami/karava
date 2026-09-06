import { useForm } from 'react-hook-form';
import { useState } from 'react';
import TextField from '../../ui/TextField';
import RHFSelect from '../../ui/RHFSelect';
import DatePickerField from '../../ui/DatePickerField';
import KaravaTagsInput from '../../ui/KaravaTagsInput';
import useCategories from '../../hooks/useCategories';
import useCreateProject from './useCreateProject';
import Loading from '../../ui/Loading';
import useEditProject from './useEditProject';
import useUser from '../authentication/useUser';
import { showProfileIncompleteModal } from '../profile/ProfileIncompleteHost';
import { parseLocalizedNumber } from '../../utils/normalizeDigits';
import {
  ACTION_TYPES,
  getProfileIncompletePayload,
  isProfileCompleteForAction,
  isProfileIncompleteError,
} from '../../utils/profileCompleteness';

function getProfilePath(role) {
  if (role === 'FREELANCER') return '/freelancer/profile';
  if (role === 'ADMIN') return '/admin/profile';
  return '/owner/profile';
}

function CreateProjectForm({ onClose, projectToEdit = {} }) {
  const { user } = useUser();
  const { _id: editId } = projectToEdit;
  const isEditMode = Boolean(editId);

  const { title, description, budget, category, deadline, tags: prevTags } =
    projectToEdit;
  let editValues = {};

  if (isEditMode) {
    editValues = {
      title,
      description,
      budget,
      category: category._id,
      deadline,
    };
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: editValues });

  const [tags, setTags] = useState(prevTags || []);
  const [date, setDate] = useState(new Date(deadline || ''));
  const { categories } = useCategories();
  const { createProject, isCreating } = useCreateProject();
  const { editProject, isEditing } = useEditProject();

  const openIncomplete = (payload) => {
    showProfileIncompleteModal({
      ...payload,
      profilePath: getProfilePath(user?.role),
    });
    onClose?.();
  };

  const onSubmit = (data) => {
    const newProject = {
      ...data,
      budget: parseLocalizedNumber(data.budget),
      deadline: new Date(date).toISOString(),
      tags,
    };

    if (isEditMode) {
      editProject(
        { id: editId, newProject },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        },
      );
      return;
    }

    const localCheck = isProfileCompleteForAction(
      user,
      ACTION_TYPES.CREATE_PROJECT,
    );

    if (!localCheck.complete) {
      openIncomplete({
        message: 'برای ثبت پروژه باید ابتدا پروفایل خود را تکمیل کنید',
        missingFields: localCheck.missingFields,
      });
      return;
    }

    createProject(newProject, {
      onSuccess: () => {
        onClose();
        reset();
      },
      onError: (error) => {
        if (!isProfileIncompleteError(error)) return;
        openIncomplete(getProfileIncompletePayload(error));
      },
    });
  };

  const isSubmitting = isCreating || isEditing;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-[649px] flex-col gap-5"
    >
      <TextField
        label="عنوان"
        name="title"
        register={register}
        required
        placeholder="مثال:طراحی لندینگ استارتاپ"
        validationSchema={{
          required: 'عنوان ضروری است',
          minLength: {
            value: 10,
            message: 'حداقل ۱۰ کاراکتر وارد کنید',
          },
        }}
        errors={errors}
      />

      <TextField
        label="توضیحات"
        name="description"
        register={register}
        required
        multiline
        placeholder="مثال:طراحی لندینگ استارتاپ"
        validationSchema={{
          required: 'توضیحات ضروری است',
          minLength: {
            value: 15,
            message: 'حداقل ۱۵ کاراکتر وارد کنید',
          },
        }}
        errors={errors}
      />

      <TextField
        label="بودجه(تومان)"
        name="budget"
        numeric
        register={register}
        required
        placeholder="25000000"
        validationSchema={{
          required: 'بودجه ضروری است',
          validate: (value) =>
            Number(value) > 0 || 'بودجه باید عدد معتبر باشد',
        }}
        errors={errors}
      />

      <RHFSelect
        label="دسته بندی"
        required
        name="category"
        register={register}
        options={categories}
        validationSchema={{ required: 'دسته بندی ضروری است' }}
        errors={errors}
      />

      <KaravaTagsInput tags={tags} onChange={setTags} />

      <DatePickerField label="ددلاین" date={date} setDate={setDate} />

      <div className="mt-auto pt-2">
        {isSubmitting ? (
          <div className="flex h-[46px] items-center justify-center">
            <Loading />
          </div>
        ) : (
          <button type="submit" className="karava-form-submit">
            تایید و ذخیره
          </button>
        )}
      </div>
    </form>
  );
}

export default CreateProjectForm;
