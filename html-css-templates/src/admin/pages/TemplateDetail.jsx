import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/adminApi";
import AdminNavbar from "../components/AdminNavbar";
import AOS from "aos";
import "aos/dist/aos.css";

const TemplateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const fetchTemplate = async () => {
    try {
      const res = await API.get(`/templates/${id}`);
      setTemplate(res.data);
    } catch (error) {
      console.error("Failed to load template", error);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchTemplate();

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [id]);

  const handlePreview = async () => {
    const res = await fetch(`http://localhost:5000/api/preview/${template._id}`);
    const data = await res.json();
    setPreviewUrl(data.previewUrl);
  };

  if (!template) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  const imageHeight = Math.min(windowSize.height * 0.6, 600);
  const imageWidth = Math.min(windowSize.width * 0.8, 1200);

  return (
    <>
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-12">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Dashboard
        </button>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={template.image}
                  alt={template.title}
                  className="rounded-lg"
                  style={{
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    objectFit: 'cover'
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-3xl font-bold">{template.title}</h1>
                <p className="text-gray-600">{template.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {template.category}
                  </span>
                  {template.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-2xl font-semibold text-green-600">
                  {template.price === 0 ? "Free" : `$${template.price}`}
                </p>

                <div>
                  <h2 className="text-xl font-semibold mb-2">What's included</h2>
                  <ul className="list-disc list-inside text-gray-700">
                    {template.features?.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handlePreview}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all duration-200"
                >
                  Live Preview
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Technical Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Languages</h3>
                <ul className="list-disc list-inside">
                  {template.languages?.map((lang, i) => (
                    <li key={i}>{lang}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Supported Devices</h3>
                <ul className="list-disc list-inside">
                  {template.supportedDevices?.map((device, i) => (
                    <li key={i}>{device}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Tech Stack</h3>
                <ul className="list-disc list-inside">
                  {template.techStack?.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {previewUrl && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={previewUrl}
                  title="Template Preview"
                  style={{
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TemplateDetail;
