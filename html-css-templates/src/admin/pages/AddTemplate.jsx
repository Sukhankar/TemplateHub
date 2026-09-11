import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import AdminNavbar from "../components/AdminNavbar";
import API from "../api/adminApi";

const AddTemplate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const recommendedLanguages = ["English", "Spanish", "French", "German", "Hindi"];
  const recommendedDevices = ["Desktop", "Tablet", "Mobile"];
  const recommendedTech = ["HTML5", "CSS3", "JavaScript", "React", "Tailwind", "Node.js"];
  const recommendedTags = ["portfolio", "developer", "modern", "responsive", "clean", "dark-mode"];
  const recommendedCategories = ["Portfolio", "Business", "E-commerce", "Blog", "Landing Page"];

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    image: "",
    zipfile: "", // direct URL string
    features: "",
    featured: false,
    languages: [],
    supportedDevices: [],
    techStack: [],
    demoUrl: "",
    tags: [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCategorySelect = (category) => {
    setForm({ ...form, category });
    setShowCategoryMenu(false);
  };

  const handleMultiCheckbox = (name, value) => {
    setForm((prev) => {
      const exists = prev[name].includes(value);
      return {
        ...prev,
        [name]: exists
          ? prev[name].filter((item) => item !== value)
          : [...prev[name], value],
      };
    });
  };

  const handleCustomAdd = (name, value) => {
    if (value.trim() === "") return;
    setForm((prev) => ({
      ...prev,
      [name]: [...new Set([...prev[name], ...value.split(",").map((v) => v.trim())])],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await API.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImageFile(imageFile);
      }

      const newTemplate = {
        tempId: uuidv4().split("-")[0],
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        image: imageUrl,
        zipfile: form.zipfile, // using string directly
        features: form.features.split(",").map((f) => f.trim()),
        featured: form.featured,
        languages: form.languages,
        supportedDevices: form.supportedDevices,
        techStack: form.techStack,
        demoUrl: form.demoUrl,
        tags: form.tags,
      };

      await API.post("/templates", newTemplate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error adding template:", error.response?.data || error.message);
      alert("Failed to add template. Check your connection or credentials.");
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">➕ Add New Template</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
          <input type="text" name="title" placeholder="Title" className="border p-2" value={form.title} onChange={handleChange} />

          {/* Category input */}
          <div className="relative">
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="border p-2 w-full"
              value={form.category}
              onChange={handleChange}
              onFocus={() => setShowCategoryMenu(true)}
            />
            {showCategoryMenu && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
                {recommendedCategories.map((category) => (
                  <div
                    key={category}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input type="number" name="price" placeholder="Price" className="border p-2" value={form.price} onChange={handleChange} />
          <input type="text" name="demoUrl" placeholder="Demo URL" className="border p-2" value={form.demoUrl} onChange={handleChange} />
          
          <textarea name="description" placeholder="Description" className="border p-2 col-span-full" rows={3} value={form.description} onChange={handleChange} />

          <textarea name="features" placeholder="Features (comma-separated)" className="border p-2 col-span-full" rows={2} value={form.features} onChange={handleChange} />

          {/* Languages */}
          <div className="col-span-full">
            <label className="font-semibold">Languages:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {recommendedLanguages.map((lang) => (
                <label key={lang} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.languages.includes(lang)}
                    onChange={() => handleMultiCheckbox("languages", lang)}
                  />
                  {lang}
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add more languages (comma-separated)"
              className="border p-2 mt-2 w-full"
              onBlur={(e) => handleCustomAdd("languages", e.target.value)}
            />
          </div>

          {/* Supported Devices */}
          <div className="col-span-full">
            <label className="font-semibold">Supported Devices:</label>
            <div className="flex gap-4 mt-2">
              {recommendedDevices.map((device) => (
                <label key={device} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.supportedDevices.includes(device)}
                    onChange={() => handleMultiCheckbox("supportedDevices", device)}
                  />
                  {device}
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add more devices (comma-separated)"
              className="border p-2 mt-2 w-full"
              onBlur={(e) => handleCustomAdd("supportedDevices", e.target.value)}
            />
          </div>

          {/* Tech Stack */}
          <div className="col-span-full">
            <label className="font-semibold">Tech Stack:</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {recommendedTech.map((tech) => (
                <label key={tech} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.techStack.includes(tech)}
                    onChange={() => handleMultiCheckbox("techStack", tech)}
                  />
                  {tech}
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add more technologies (comma-separated)"
              className="border p-2 mt-2 w-full"
              onBlur={(e) => handleCustomAdd("techStack", e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="col-span-full">
            <label className="font-semibold">Tags:</label>
            <div className="flex flex-wrap gap-3 mt-2">
              {recommendedTags.map((tag) => (
                <label key={tag} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={form.tags.includes(tag)}
                    onChange={() => handleMultiCheckbox("tags", tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add more tags (comma-separated)"
              className="border p-2 mt-2 w-full"
              onBlur={(e) => handleCustomAdd("tags", e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <label className="flex flex-col col-span-full">
            Template Image
            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1" />
          </label>

          <div className="flex flex-col gap-1 col-span-full">
            <label className="font-semibold">Template Files:</label>
            <input 
              type="text" 
              name="zipfile" 
              placeholder="Enter Zip File URL" 
              className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={form.zipfile} 
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide a direct download link to the template's zip file
            </p>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-2 col-span-full">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Featured Template
          </label>

          <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Submit Template
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTemplate;
