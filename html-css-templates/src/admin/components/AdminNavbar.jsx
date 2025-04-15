import { Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminNavbar = () => {
  const { logout } = useAdminAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/admin/dashboard" className="text-xl font-bold">Admin Panel</Link>
      <div className="flex gap-4">
        <Link to="/admin/add">Add</Link>
        <button onClick={logout} className="hover:underline text-red-300">Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
