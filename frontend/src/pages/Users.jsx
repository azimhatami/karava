import UsersTable from '../features/admin/users/UsersTable';


function Users() {
  return(
    <div>
      <h2 className='font-black text-secondary-700 text-xl mb-8'>کاربران</h2>
      <UsersTable />
    </div>
  );
}


export default Users
