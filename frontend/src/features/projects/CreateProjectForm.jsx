import { useForm } from "react-hook-form";
import TextField from "../../ui/TextField";
import RHFSelect from "../../ui/RHFSelect";
import { TagsInput } from "react-tag-input-component";
import { useState } from "react";
import DatePickerField from "../../ui/DatePickerField";
import useCategories from '../../hooks/useCategories';
import useCreateProject from './useCreateProject';
import Loading from "../../ui/Loading";
import useEditProject from './useEditProject';


function CreateProjectForm({ onClose, projectToEdit={} }) {

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
      editProject({ id: editId, newProject }, {
        onSuccess: () => {
          onClose();
          reset();
        },
      })
    }else {
    createProject(newProject, {
      onSuccess: () => {
        onClose();
        reset();
      }})
    } 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextField
        label="عنوان"
        name="title"
        register={register}
        required
        validationSchema={{
          required: "عنوان ضروری است",
          minLength: {
            value: 10,
            message: "حداقل ۱۰ کاراکتر وارد کنید",
          },
        }}
        errors={errors}
      />
      <TextField
        label="توضیحات"
        name="description"
        register={register}
        required
        validationSchema={{
          required: "توضیحات ضروری است",
          minLength: {
            value: 15,
            message: "حداقل ۱۵ کاراکتر وارد کنید",
          },
        }}
        errors={errors}
      />
      <TextField
        label="بودجه"
        name="budget"
        type="number"
        register={register}
        required
        validationSchema={{
          required: "بودجه ضروری است",
        }}
        errors={errors}
      />
      <RHFSelect
        label="دسته بندی"
        required
        name="category"
        register={register}
        options={categories}
      />
      <div>
        <label className="mb-2 block text-secondary-700">تگ ها</label>
        <TagsInput value={tags} onChange={setTags} name="tags" />
      </div>
      <DatePickerField label='ددلاین' date={date} setDate={setDate} />
      <div>
        {isCreating ? <Loading /> : (
          <button type="submit" className="btn btn-primary w-full">
           تایید
          </button>
        )}
      </div>
    </form>
  );
}

export default CreateProjectForm;
