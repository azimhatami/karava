function ConfirmDelete({ name, onClose, disabled, onConfirm }) {
  return(
    <>
      <h2 className='font-bold text-sm mb-6'>آیا از حذف {name} مطمعن هستید؟</h2>
      <div className='flex justify-between items-center gap-x-16'>
        <button 
          className='btn btn-primary flex-1'
          onClick={onClose}
          disabled={disabled}
        >
          لغو
        </button>
        <button 
          className='btn btn-danger flex-1'
          disabled={disabled}
          onClick={onConfirm}
        >
          تایید
        </button>
      </div>
    </>
  );
}


export default ConfirmDelete
