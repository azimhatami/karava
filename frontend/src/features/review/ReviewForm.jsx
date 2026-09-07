import { useState } from 'react';
import StarRating from './StarRating';
import useCreateReview from './useCreateReview';

function ReviewForm({ projectId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { isSubmitting, createReview } = useCreateReview();

  const onSubmit = (event) => {
    event.preventDefault();
    if (!rating) {
      setError('امتیاز را انتخاب کنید');
      return;
    }
    setError('');
    createReview(
      {
        projectId,
        rating,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          setComment('');
          onSuccess?.();
        },
      },
    );
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <p className="mb-2 text-sm font-bold text-[#222020]">امتیاز شما</p>
        <StarRating value={rating} onChange={setRating} />
        {error ? (
          <p className="mt-1 text-xs text-[#BE185D]">{error}</p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-bold text-[#222020]"
        >
          نظر (اختیاری)
        </label>
        <textarea
          id="review-comment"
          value={comment}
          maxLength={500}
          rows={4}
          onChange={(event) => setComment(event.target.value)}
          placeholder="تجربه همکاری را بنویسید..."
          className="w-full rounded-[8px] border border-[#D1D5DB] px-3 py-2 text-sm text-[#222020] outline-none focus:border-[#006045]"
        />
        <p className="mt-1 text-left text-xs text-[#9CA3AF]">
          {comment.length}/500
        </p>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {isSubmitting ? 'در حال ثبت...' : 'ثبت نظر'}
      </button>
    </form>
  );
}

export default ReviewForm;
