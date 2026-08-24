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

function CreateProjectForm({ onClose, projectToEdit = {} }) {
  const { _id: editId } = projectToEdit;
  const isEditMode = Boolean(editId);

  const { title, description, budget, category, deadline, tags: prevTags } = projectToEdit;
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

  const onSubmit = (data) => {
    const newProject = {
      ...data,
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

    createProject(newProject, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  const isSubmitting = isCreating || isEditing;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-[649px] flex-col gap-5">
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
        type="number"
        register={register}
        required
        placeholder="25,000,000"
        validationSchema={{
          required: 'بودجه ضروری است',
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
