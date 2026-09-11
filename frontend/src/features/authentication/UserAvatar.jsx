import useUser from './useUser';


function UserAvatar() {

  const { user, isLoading } = useUser();

  return(
    <>
      <div className='flex items-center gap-x-2 text-ink-muted'>
        <img 
          src='/user.jpg' 
          alt='user avatar'
          className='w-7 h-7 rounded-full object-cover object-center'
        />
        <span>{user?.name}</span>
      </div>
    </>
  );
}


export default UserAvatar
