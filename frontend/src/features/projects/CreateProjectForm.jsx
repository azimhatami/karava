import { useForm } from 'react-hook-form';
import { useState } from 'react';
import TextField from '../../ui/TextField';
import RHFSelect from '../../ui/RHFSelect';
import DatePickerField from '../../ui/DatePickerField';
import KaravaTagsInput from '../../ui/KaravaTagsInput';
import FileUploadField from '../../ui/FileUploadField';
import useCategories from '../../hooks/useCategories';
import useCreateProject from './useCreateProject';
import Loading from '../../ui/Loading';
import useEditProject from './useEditProject';
import useUser from '../authentication/useUser';
import { showProfileIncompleteModal } from '../profile/ProfileIncompleteHost';
import { parseLocalizedNumber } from '../../utils/normalizeDigits';
import { validateUploadFile } from '../../utils/uploadValidation';
import { uploadProjectAttachment } from '../../services/uploadService';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
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
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
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
          onSuccess: async () => {
            if (attachmentFile) {
              const validationError = validateUploadFile(
                attachmentFile,
                'attachment',
              );
              if (validationError) {
                setAttachmentError(validationError);
                return;
              }
              try {
                setIsUploadingAttachment(true);
                await uploadProjectAttachment(editId, attachmentFile);
                toast.success('ضمیمه پروژه آپلود شد');
              } catch (error) {
                toast.error(
                  getApiErrorMessage(error, 'آپلود ضمیمه پروژه انجام نشد'),
                );
                return;
              } finally {
                setIsUploadingAttachment(false);
              }
            }
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
      onSuccess: async (response) => {
        const projectId = response?.project?._id;
        if (attachmentFile && projectId) {
          const validationError = validateUploadFile(
            attachmentFile,
            'attachment',
          );
          if (validationError) {
            setAttachmentError(validationError);
            toast.error(validationError);
            return;
          }
          try {
            setIsUploadingAttachment(true);
            await uploadProjectAttachment(projectId, attachmentFile);
            toast.success('ضمیمه پروژه آپلود شد');
          } catch (error) {
            toast.error(
              getApiErrorMessage(error, 'پروژه ثبت شد ولی آپلود ضمیمه ناموفق بود'),
            );
          } finally {
            setIsUploadingAttachment(false);
          }
        }
        onClose();
        reset();
        setAttachmentFile(null);
      },
      onError: (error) => {
        if (!isProfileIncompleteError(error)) return;
        openIncomplete(getProfileIncompletePayload(error));
      },
    });
  };

  const isSubmitting = isCreating || isEditing || isUploadingAttachment;

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

      <div className="space-y-2">
        <FileUploadField
          kind="attachment"
          label="ضمیمه فایل (اختیاری)"
          hint="مستندات، طرح یا اسپک — تصویر، pdf، doc، docx یا zip"
          onUpload={async (file) => {
            setAttachmentError('');
            setAttachmentFile(file);
          }}
        />
        {attachmentFile ? (
          <p className="text-xs text-[#006045]">
            فایل انتخاب‌شده: {attachmentFile.name} (پس از ذخیره پروژه آپلود می‌شود)
          </p>
        ) : null}
        {attachmentError ? (
          <p className="text-xs text-karava-red">{attachmentError}</p>
        ) : null}
      </div>

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
