import { Link } from "react-router-dom";

const TemplateCard = ({ template, onDelete, onEdit }) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 relative">
      {template.featured && (
        <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded font-semibold">
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
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{template.title}</h3>
          <span className={`text-sm font-medium ${template.price === 0 ? 'text-green-600' : 'text-blue-600'}`}>
            {template.price === 0 ? 'Free' : `$${template.price}`}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {template.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 px-2 py-1 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onEdit(template._id)}
            className="text-blue-500 hover:text-blue-600"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(template._id)}
            className="text-red-500 hover:text-red-600"
          >
            🗑️ Delete
          </button>
          <Link
            to={`/admin/template/${template._id}`}
            className="text-green-500 hover:text-green-600"
          >
            📄 View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
