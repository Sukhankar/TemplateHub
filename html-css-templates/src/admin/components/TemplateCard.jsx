import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const TemplateCard = ({ template, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] duration-300 ease-in-out relative flex flex-col">
      {template.featured && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-semibold z-10">
          Featured
        </span>
      )}
      <Link to={`/admin/template/${template._id}`}>
        <img
          src={template.image}
          alt={template.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">{template.title}</h3>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none text-xl px-2"
              title="Options"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-28 bg-white border rounded shadow-md">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(template._id);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(template._id);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
        <div className="flex-grow" />
        <div className="flex justify-between items-center mt-auto">
          <span className="inline-block bg-gray-200 px-2 py-1 text-xs rounded mr-2">
            {template.category}
          </span>
          <span className={`text-lg font-semibold ${template.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
            {template.price === 0 ? 'Free' : `$${template.price}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
