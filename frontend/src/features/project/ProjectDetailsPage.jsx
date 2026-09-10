import ProjectAttachmentsSection from '../../ui/ProjectAttachmentsSection';
import { uploadProjectDeliverable } from '../../services/uploadService';
import toast from '../../ui/toast';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import { toPersianNumbers, toPersianNumbersWithComma } from '../../utils/toPersianNumbers';
import { formatProposalDuration } from '../../utils/formatProposalDuration';
import shortDate from '../../utils/shortDate';
import FileUploadField, { FileList } from '../../ui/FileUploadField';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineTag,
  HiOutlineUser,
} from 'react-icons/hi2';
import usePublicProjectDetails from './usePublicProjectDetails';
import useUser from '../authentication/useUser';
import HomeHeader from '../home/HomeHeader';
import Modal from '../../ui/Modal';
import Loading from '../../ui/Loading';
import QueryErrorState from '../../ui/QueryErrorState';
import CreateProposal from '../proposals/CreateProposal';
import ReviewSection from '../review/ReviewSection';
import RatingBadge from '../review/RatingBadge';

const PROPOSAL_STATUS = {
  0: {
    label: 'پیشنهاد شما رد شده است',
    className: 'border-[#F9A8D4] bg-[#FDF2F8] text-[#BE185D]',
  },
  1: {
    label: 'شما قبلاً پیشنهاد داده‌اید - در انتظار بررسی',
    className: 'border-[#D1D5DB] bg-[#F3F4F6] text-[#374151]',
  },
  2: {
    label: 'پیشنهاد شما پذیرفته شد',
    className: 'border-[#00D281] bg-[#ECFDF5] text-[#006045]',
  },
};

function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { project, myProposal, isLoading, isError, error, refetch } =
    usePublicProjectDetails();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-karava-bg-subtle">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 md:py-8 xl:px-[108px]">
          <HomeHeader variant="paper" />
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-karava-bg-subtle">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 md:py-8 xl:px-[108px]">
          <HomeHeader variant="paper" />
          <div className="mt-10">
            <QueryErrorState
              error={error}
              message={
                error?.response?.status === 404
                  ? 'پروژه یافت نشد یا حذف شده است.'
                  : undefined
              }
              onRetry={refetch}
            />
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="inline-flex text-sm font-bold text-[#006045] hover:text-[#004d37]"
              >
                بازگشت به لیست پروژه‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOpen = project.status === 'OPEN';
  const isCompleted = project.status === 'COMPLETED';
  const proposalStatus = PROPOSAL_STATUS[myProposal?.status];

  const handleProposalClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'FREELANCER') {
      navigate('/auth');
      return;
    }
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-karava-bg-subtle">
      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 py-6 md:px-8 md:py-8 xl:px-[108px]">
        <HomeHeader variant="paper" />

        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#006045] hover:text-[#004d37]"
          >
            <HiOutlineArrowRight className="h-4 w-4" />
            بازگشت به پروژه‌ها
          </Link>
          <span
            className={`inline-flex rounded-[6px] border px-2.5 py-1 text-xs font-medium ${
              isCompleted
                ? 'border-[#7DD3FC] bg-[#E0F2FE] text-[#075985]'
                : isOpen
                  ? 'border-[#00D281] bg-[#008245] text-white'
                  : 'border-[#C9093D] bg-[#FFF1F2] text-[#BE185D]'
            }`}
          >
            {isCompleted ? 'تکمیل‌شده' : isOpen ? 'باز' : 'بسته'}
          </span>
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-6 rounded-[12px] border border-[#222020] bg-white p-6">
            <div className="space-y-3 text-right">
              <p className="text-sm text-[#6E6E6E]">
                {project.category?.title || 'بدون دسته'}
              </p>
              <h1 className="text-2xl font-bold leading-9 text-[#222020]">
                {project.title}
              </h1>
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#4B5563]">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoChip
                icon={HiOutlineBriefcase}
                label="بودجه"
                value={`${toPersianNumbersWithComma(project.budget || 0)} تومان`}
              />
              <InfoChip
                icon={HiOutlineClock}
                label="ددلاین"
                value={project.deadline ? shortDate(project.deadline) : '—'}
              />
              <InfoChip
                icon={HiOutlineCalendarDays}
                label="تاریخ ثبت"
                value={project.createdAt ? shortDate(project.createdAt) : '—'}
              />
              <InfoChip
                icon={HiOutlineTag}
                label="تعداد پیشنهادها"
                value={`${toPersianNumbers(project.proposalCount || 0)} پیشنهاد`}
              />
            </div>

            <div className="space-y-3 text-right">
              <h2 className="text-sm font-bold text-[#222020]">مهارت‌ها و تگ‌ها</h2>
              {(project.tags || []).length ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-[6px] border border-[#007A55] bg-[#8EC3A9] px-2.5 py-1.5 text-xs text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6E6E6E]">تگی ثبت نشده است</p>
              )}
            </div>

            <ProjectAttachmentsSection
              files={project.attachments || []}
              requireAuth
              isAuthenticated={Boolean(user)}
              onRequireAuth={() => navigate('/auth')}
            />

            {(project.isAssignedFreelancer ||
              myProposal?.status === 2 ||
              project.isOwner ||
              (project.deliverables || []).length > 0) && (
              <div className="space-y-3 text-right">
                <h2 className="text-sm font-bold text-[#222020]">تحویل کار</h2>
                {project.isAssignedFreelancer || myProposal?.status === 2 ? (
                  <FileUploadField
                    kind="deliverable"
                    label="ارسال فایل تحویل"
                    hint="پس از پذیرش پیشنهاد می‌توانید فایل نهایی را آپلود کنید"
                    onUpload={async (file) => {
                      try {
                        const { message } = await uploadProjectDeliverable(
                          project._id,
                          file,
                        );
                        toast.success(message || 'فایل تحویل آپلود شد');
                        refetch();
                      } catch (error) {
                        toast.error(
                          getApiErrorMessage(error, 'آپلود فایل تحویل انجام نشد'),
                        );
                        throw error;
                      }
                    }}
                  />
                ) : null}
                <FileList
                  files={project.deliverables || []}
                  emptyText="هنوز فایل تحویلی ارسال نشده است"
                  showThumbnails={false}
                />
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-[12px] border border-[#0E6A50] bg-[#F8FFFC] p-4">
              <div className="mb-3 flex items-center gap-2 text-[#006045]">
                <HiOutlineUser className="h-5 w-5" />
                <h2 className="text-sm font-bold">اطلاعات کارفرما</h2>
              </div>
              <div className="space-y-2 text-right text-sm text-[#222020]">
                {project.owner?._id ? (
                  <Link
                    to={`/users/${project.owner._id}`}
                    className="font-bold text-[#006045] hover:underline"
                  >
                    {project.owner?.name || 'کارفرما'}
                  </Link>
                ) : (
                  <p className="font-bold">{project.owner?.name || 'کارفرما'}</p>
                )}
                <div>
                  <RatingBadge
                    averageRating={project.owner?.averageRating}
                    totalReviews={project.owner?.totalReviews}
                  />
                </div>
                {project.owner?.companyName ? (
                  <p className="text-[#006045]">{project.owner.companyName}</p>
                ) : null}
                {project.owner?.companyDescription ? (
                  <p className="leading-6 text-[#6E6E6E]">
                    {project.owner.companyDescription}
                  </p>
                ) : null}
                <p className="text-xs text-[#6E6E6E]">
                  تعداد پروژه‌های ثبت‌شده:{' '}
                  {toPersianNumbers(project.ownerProjectCount || 0)}
                </p>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#D1D5DB] bg-white p-4">
              <h2 className="mb-3 text-right text-sm font-bold text-[#222020]">
                ارسال پیشنهاد
              </h2>

              {!isOpen ? (
                <p className="rounded-[8px] border border-[#F9A8D4] bg-[#FFF1F2] p-3 text-right text-sm text-[#BE185D]">
                  این پروژه دیگر پیشنهاد نمی‌پذیرد.
                </p>
              ) : myProposal ? (
                <div
                  className={`rounded-[8px] border p-3 text-right text-sm ${proposalStatus.className}`}
                >
                  <p className="font-bold">{proposalStatus.label}</p>
                  <p className="mt-2 text-xs opacity-90">
                    قیمت پیشنهادی:{' '}
                    {toPersianNumbersWithComma(myProposal.price)} تومان
                  </p>
                  <p className="mt-1 text-xs opacity-90">
                    مدت:{' '}
                    {formatProposalDuration(
                      myProposal.duration,
                      myProposal.durationUnit,
                    )}
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleProposalClick}
                  className="karava-form-submit"
                >
                  {user ? 'ارسال درخواست' : 'ورود و ارسال درخواست'}
                </button>
              )}
            </div>
          </aside>
        </section>

        <ReviewSection
          project={project}
          canParticipate={
            Boolean(project.isOwner || project.isAssignedFreelancer)
          }
        />
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`درخواست انجام پروژه ${project.title}`}
      >
        <CreateProposal
          onClose={() => {
            setOpen(false);
            refetch();
          }}
          projectId={project._id}
        />
      </Modal>
    </div>
  );
}

function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-3 text-right">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#E8F3EE] text-[#006045]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#6E6E6E]">{label}</p>
        <p className="mt-1 text-sm font-bold text-[#222020]">{value}</p>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
