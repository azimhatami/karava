function ConfirmDelete({ name, onClose, disabled, onConfirm }) {
  return (
    <>
      <h2 className="mb-6 text-sm font-bold">آیا از حذف {name} مطمئن هستید؟</h2>
      <div className="flex items-center justify-between gap-x-4">
        <button
          type="button"
          className="btn btn-outline flex-1 py-3"
          onClick={onClose}
          disabled={disabled}
        >
          لغو
        </button>
        <button
          type="button"
          className="btn btn-danger flex-1"
          disabled={disabled}
          onClick={onConfirm}
        >
          تایید
        </button>
      </div>
    </>
  );
}

export default ConfirmDelete;
