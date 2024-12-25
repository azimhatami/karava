import { useForm } from "react-hook-form";
import TextField from "../../ui/TextField";
import RHFSelect from "../../ui/RHFSelect";
import { TagsInput } from "react-tag-input-component";
import { useState } from "react";
import DatePickerField from "../../ui/DatePickerField";

function CreateProjectForm() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [tags, setTags] = useState([]);

  const [date, setDate] = useState(new Date());

  const onSubmit = (data) => {
    console.log(data);
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
        name="title"
        register={register}
        required
        validationSchema={{
          required: "توضیحات ضروری است",
          minLength: {
            value: 10,
            message: "حداقل ۱۰ کاراکتر وارد کنید",
          },
        }}
        errors={errors}
      />
      <TextField
        label="بودجه"
        name="price"
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
        options={[]}
      />
      <div>
        <label className="mb-2 block text-secondary-700">تگ ها</label>
        <TagsInput value={tags} onChange={setTags} name="tags" />
      </div>
      <DatePickerField label='ددلاین' date={date} setDate={setDate} />
      <button type="submit" className="btn btn-primary w-full">
        تایید
      </button>
    </form>
  );
}

export default CreateProjectForm;
