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
  HiOutlineLockClosed,
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
    className: 'bg-ink-amber-tint text-ink-amber-deep',
  },
  1: {
    label: 'شما قبلاً پیشنهاد داده‌اید - در انتظار بررسی',
    className: 'bg-ink-well text-ink-muted',
  },
  2: {
    label: 'پیشنهاد شما پذیرفته شد',
    className: 'bg-ink-mint-tint text-ink-mint-deep',
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
      <div className="min-h-screen bg-ink-paper">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 xl:px-[140px]">
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
      <div className="min-h-screen bg-ink-paper">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 xl:px-[140px]">
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
                className="inline-flex text-sm font-bold text-ink-mint-mid hover:text-ink-mint-deep"
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
    <div className="min-h-screen bg-ink-paper">
      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 pb-16 pt-6 md:px-8 xl:px-[140px]">
        <HomeHeader variant="paper" />

        <div className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13.5px] font-bold text-ink-mint-mid transition-colors hover:text-ink-mint-deep"
          >
            <HiOutlineArrowRight className="h-4 w-4" />
            بازگشت به پروژه‌ها
          </Link>
          <span
            className={`ink-chip ${
              isCompleted
                ? 'bg-[#EEF1F5] text-[#46586B]'
                : isOpen
                  ? 'bg-ink-mint-tint text-ink-mint-deep'
                  : 'bg-ink-amber-tint text-ink-amber-deep'
            }`}
          >
            {isCompleted ? 'تکمیل‌شده' : isOpen ? 'باز' : 'بسته'}
          </span>
        </div>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="ink-card flex flex-col gap-7 p-6 md:p-8">
            <div className="space-y-3 text-right">
              <p className="text-[13px] text-ink-dim">
                {project.category?.title || 'بدون دسته'}
              </p>
              <h1 className="text-[28px] font-black leading-[1.4] tracking-[-0.015em] text-ink-text">
                {project.title}
              </h1>
              <p className="whitespace-pre-wrap text-[15px] leading-[2.1] text-ink-body">
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
              <h2 className="text-[13px] text-ink-dim">مهارت‌ها و تگ‌ها</h2>
              {(project.tags || []).length ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex h-8 items-center rounded-lg border border-ink-line px-3.5 font-['Sora',_sans-serif] text-[13px] text-ink-body"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-ink-dim">تگی ثبت نشده است</p>
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
                <h2 className="text-[13px] text-ink-dim">تحویل کار</h2>
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
            <EscrowExplainer isCompleted={isCompleted} />

            <div className="ink-card p-5">
              <div className="mb-4 flex items-center gap-2 text-ink-muted">
                <HiOutlineUser className="h-5 w-5" />
                <h2 className="text-[13px]">کارفرما</h2>
              </div>
              <div className="space-y-2.5 text-right text-sm text-ink-text">
                {project.owner?._id ? (
                  <Link
                    to={`/users/${project.owner._id}`}
                    className="text-[15px] font-bold text-ink-text hover:text-ink-mint-mid"
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
                  <p className="text-[13px] font-medium text-ink-mint-mid">{project.owner.companyName}</p>
                ) : null}
                {project.owner?.companyDescription ? (
                  <p className="text-[13px] leading-6 text-ink-muted">
                    {project.owner.companyDescription}
                  </p>
                ) : null}
                <p className="text-xs text-ink-dim">
                  تعداد پروژه‌های ثبت‌شده:{' '}
                  {toPersianNumbers(project.ownerProjectCount || 0)}
                </p>
              </div>
            </div>

            <div className="ink-card p-5">
              <h2 className="mb-4 text-right text-[15px] font-bold text-ink-text">
                ارسال پیشنهاد
              </h2>

              {!isOpen ? (
                <p className="rounded-xl bg-ink-amber-tint p-3.5 text-right text-[13px] leading-6 text-ink-amber-deep">
                  این پروژه دیگر پیشنهاد نمی‌پذیرد.
                </p>
              ) : myProposal ? (
                <div
                  className={`rounded-xl p-3.5 text-right text-[13px] ${proposalStatus.className}`}
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
                  className="ink-btn-accent w-full"
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

const ESCROW_STEPS = [
  {
    title: 'پذیرش پیشنهاد',
    note: 'بودجه از کیف پول کارفرما بلوکه می‌شود.',
  },
  {
    title: 'انجام و تحویل کار',
    note: 'گفتگو و ارسال فایل تحویل در همین صفحه.',
  },
  {
    title: 'آزادسازی مبلغ',
    note: 'با تأیید کارفرما به کیف پول فریلنسر واریز می‌شود.',
  },
];

/** Static explainer — escrow is what the platform offers, but nothing in the
 *  UI said so before. */
function EscrowExplainer({ isCompleted }) {
  return (
    <div className="rounded-2xl bg-ink p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <HiOutlineLockClosed className="h-[18px] w-[18px] text-ink-mint" />
        <h2 className="text-sm font-bold text-[#F2F6F4]">پرداخت امن کارآوا</h2>
      </div>

      <ol className="flex flex-col gap-3.5">
        {ESCROW_STEPS.map((step, index) => {
          const done = isCompleted;
          return (
            <li key={step.title} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                  done
                    ? 'border-ink-mint bg-ink-mint'
                    : 'border-white/30 bg-transparent'
                }`}
                aria-hidden="true"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    done ? 'bg-ink' : 'bg-transparent'
                  }`}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-bold text-[#F2F6F4]">
                  {toPersianNumbers(index + 1)}. {step.title}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-[1.85] text-ink-dim">
                  {step.note}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function InfoChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-hair bg-ink-card p-4 text-right">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-well text-ink-mint-deep">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-ink-dim">{label}</p>
        <p className="mt-1 text-[15px] font-bold text-ink-text">{value}</p>
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
