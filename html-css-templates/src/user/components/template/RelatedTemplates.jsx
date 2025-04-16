const RelatedTemplates = ({ templates, navigate }) => (
    <div className="mt-12" data-aos="fade-up">
      <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {templates.map((related) => (
          <div
            key={related._id}
            className="min-w-[220px] bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={related.image}
              alt={related.title}
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <div className="p-3">
              <h3 className="text-sm font-bold truncate">{related.title}</h3>
              <p className="text-xs text-gray-500 truncate">{related.category}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-green-600">
                  {related.price === 0 ? "Free" : `₹${related.price}`}
                </span>
                <button
                  onClick={() => navigate(`/template/${related._id}`)}
                  className="text-blue-500 text-xs underline"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default RelatedTemplates;
  