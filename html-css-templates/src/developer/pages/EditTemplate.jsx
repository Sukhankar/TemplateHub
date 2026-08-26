import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DeveloperNavbar from "../components/DeveloperNavbar";
import * as devApi from "../api/developerApi";
import axiosInstance from "../../user/utils/axiosInstance";

const EditTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "landing-page",
    compatibility: "All Modern Browsers",
    license: "personal",
    livePreviewUrl: "",
    price: 0,
    isFree: false,
    tags: "",
  });

  const [sourceFile, setSourceFile] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axiosInstance.get(`/templates/${id}`);
        const tpl = res.data;

        setForm({
          title: tpl.title || "",
          description: tpl.description || "",
          category: tpl.category || "landing-page",
          compatibility: tpl.compatibility || "All Modern Browsers",
          license: tpl.license || "personal",
          livePreviewUrl: tpl.livePreviewUrl || "",
          price: tpl.price || 0,
          isFree: tpl.isFree || false,
          tags: Array.isArray(tpl.tags) ? tpl.tags.join(", ") : tpl.tags || "",
        });
      } catch (err) {
        setError("Failed to load template details.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("compatibility", form.compatibility);
      formData.append("license", form.license);
      formData.append("livePreviewUrl", form.livePreviewUrl);
      formData.append("price", form.isFree ? 0 : form.price);
      formData.append("isFree", form.isFree);
      formData.append("tags", form.tags);

      if (sourceFile) {
        formData.append("sourceFile", sourceFile);
      }

      const res = await devApi.updateTemplate(id, formData);
      setSuccessMsg(res.message || "Template updated successfully!");

      setTimeout(() => {
        navigate("/developer/templates");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update template");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <DeveloperNavbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DeveloperNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">Edit Template Details</h1>
          <p className="text-xs text-slate-400 mt-1">
            Note: Replacing the source ZIP file will require admin re-approval.
          </p>
        </div>

        {error && (
          <div className="p-4 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              >
                <option value="landing-page">Landing Page</option>
                <option value="portfolio">Portfolio</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="blog">Blog / Magazine</option>
                <option value="dashboard">Admin / Dashboard</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo URL</label>
              <input
                type="url"
                name="livePreviewUrl"
                value={form.livePreviewUrl}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-white">Free Template</h4>
              <p className="text-xs text-slate-400">Mark as free product</p>
            </div>
            <input
              type="checkbox"
              name="isFree"
              checked={form.isFree}
              onChange={handleChange}
              className="w-5 h-5 accent-indigo-600 rounded"
            />
          </div>

          {!form.isFree && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($ USD)</label>
              <input
                type="number"
                name="price"
                min={1}
                value={form.price}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Replace Source ZIP Archive (Optional)
            </label>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => setSourceFile(e.target.files?.[0] || null)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/developer/templates")}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditTemplate;
