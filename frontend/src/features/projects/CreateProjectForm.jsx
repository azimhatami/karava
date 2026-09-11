import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import TextField from '../../ui/TextField';
import RHFSelect from '../../ui/RHFSelect';
import DatePickerField from '../../ui/DatePickerField';
import KaravaTagsInput from '../../ui/KaravaTagsInput';
import FileUploadField from '../../ui/FileUploadField';
import ProjectAttachmentsSection from '../../ui/ProjectAttachmentsSection';
import useCategories from '../../hooks/useCategories';
import useCreateProject from './useCreateProject';
import Loading from '../../ui/Loading';
import useEditProject from './useEditProject';
import useUser from '../authentication/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { showProfileIncompleteModal } from '../profile/ProfileIncompleteHost';
import { parseLocalizedNumber } from '../../utils/normalizeDigits';
import { validateUploadFile, formatFileSize, isImageFileMeta } from '../../utils/uploadValidation';
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
  const queryClient = useQueryClient();
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
  const [savedAttachments, setSavedAttachments] = useState(
    () => projectToEdit.attachments || [],
  );
  const { categories } = useCategories();
  const { createProject, isCreating } = useCreateProject();
  const { editProject, isEditing } = useEditProject();

  useEffect(() => {
    setSavedAttachments(projectToEdit.attachments || []);
  }, [projectToEdit]);

  const pendingPreviewUrl = useMemo(() => {
    if (!attachmentFile || !isImageFileMeta({ originalName: attachmentFile.name, mimeType: attachmentFile.type })) {
      return null;
    }
    return URL.createObjectURL(attachmentFile);
  }, [attachmentFile]);

  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    };
  }, [pendingPreviewUrl]);

  const openIncomplete = (payload) => {
    showProfileIncompleteModal({
      ...payload,
      profilePath: getProfilePath(user?.role),
    });
    onClose?.();
  };

  const uploadAttachmentForProject = async (projectId, file) => {
    const validationError = validateUploadFile(file, 'attachment');
    if (validationError) {
      setAttachmentError(validationError);
      throw new Error(validationError);
    }
    setIsUploadingAttachment(true);
    try {
      const { file: uploaded, message } = await uploadProjectAttachment(
        projectId,
        file,
      );
      setSavedAttachments((prev) => [...prev, uploaded]);
      setAttachmentFile(null);
      toast.success(message || 'ضمیمه پروژه آپلود شد');
      queryClient.invalidateQueries({ queryKey: ['owner-projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      return uploaded;
    } finally {
      setIsUploadingAttachment(false);
    }
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
              try {
                await uploadAttachmentForProject(editId, attachmentFile);
              } catch (error) {
                toast.error(
                  getApiErrorMessage(error, 'آپلود ضمیمه پروژه انجام نشد'),
                );
                return;
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
        if (!projectId) {
          toast.error('پروژه ثبت شد ولی شناسه پروژه دریافت نشد');
          onClose();
          return;
        }

        if (attachmentFile) {
          try {
            await uploadAttachmentForProject(projectId, attachmentFile);
          } catch (error) {
            toast.error(
              getApiErrorMessage(
                error,
                'پروژه ثبت شد ولی آپلود ضمیمه ناموفق بود',
              ),
            );
          }
        }
        onClose();
        reset();
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

      <div className="space-y-3">
        <FileUploadField
          kind="attachment"
          label="ضمیمه فایل (اختیاری)"
          hint="مستندات، طرح یا اسپک — تصویر، pdf، doc، docx یا zip"
          disabled={isUploadingAttachment}
          onUpload={async (file) => {
            setAttachmentError('');
            // In edit mode, upload immediately so the file appears in the form right away.
            if (isEditMode && editId) {
              try {
                await uploadAttachmentForProject(editId, file);
              } catch (error) {
                toast.error(
                  getApiErrorMessage(error, 'آپلود ضمیمه پروژه انجام نشد'),
                );
                throw error;
              }
              return;
            }
            setAttachmentFile(file);
          }}
        />

        {attachmentFile ? (
          <div className="flex items-center gap-3 rounded-[10px] border border-[#1E7C50] bg-[#FBFAF6] p-3">
            {pendingPreviewUrl ? (
              <img
                src={pendingPreviewUrl}
                alt={attachmentFile.name}
                className="h-14 w-14 rounded-[8px] object-cover"
              />
            ) : null}
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-[13px] font-bold text-ink-mint-mid">
                {attachmentFile.name}
              </p>
              <p className="mt-1 text-[12.5px] text-ink-muted">
                {formatFileSize(attachmentFile.size)} — پس از ذخیره پروژه آپلود می‌شود
              </p>
            </div>
            <button
              type="button"
              className="text-xs font-bold text-[#BE185D]"
              onClick={() => setAttachmentFile(null)}
            >
              حذف
            </button>
          </div>
        ) : null}

        {attachmentError ? (
          <p className="text-xs text-[#C9093D]">{attachmentError}</p>
        ) : null}

        {savedAttachments.length ? (
          <ProjectAttachmentsSection
            files={savedAttachments}
            title="ضمائم ذخیره‌شده"
            emptyText=""
          />
        ) : null}
      </div>

      <div className="mt-auto pt-2">
        {isSubmitting ? (
          <div className="flex h-[46px] items-center justify-center">
            <Loading />
          </div>
        ) : (
          <button type="submit" className="ink-btn-accent w-full">
            تایید و ذخیره
          </button>
        )}
      </div>
    </form>
  );
}

export default CreateProjectForm;
