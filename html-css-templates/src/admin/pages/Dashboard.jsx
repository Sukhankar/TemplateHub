import { useEffect, useState } from "react";
import API from "../api/adminApi";
import { useNavigate, Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import TemplateCard from "../components/TemplateCard";

const Dashboard = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    const res = await API.get("/templates");
    setTemplates(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this template?")) {
      await API.delete(`/templates/${id}`);
      fetchTemplates();
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">📦 Templates</h2>
          <Link
            to="/admin/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            ➕ Add Template
          </Link>
        </div>

        {templates.length === 0 ? (
          <p className="text-gray-500">No templates found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {templates.map((t) => (
              <TemplateCard
                key={t.id}
                template={t}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
