import UsersTable from '../features/admin/users/UsersTable';


function Users() {
  return (
    <div className="flex w-full flex-col">
      <h2 className="owner-panel-title mb-6">کاربران</h2>
      <UsersTable />
    </div>
  );
}


export default Users
