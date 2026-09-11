import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeveloperNavbar from "../components/DeveloperNavbar";
import * as devApi from "../api/developerApi";
import { FaUpload, FaCheckCircle, FaFileArchive, FaImages, FaDollarSign } from "react-icons/fa";

const UploadTemplate = () => {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "landing-page",
    compatibility: "All Modern Browsers",
    license: "personal",
    livePreviewUrl: "",
    price: 19,
    isFree: false,
    tags: "react, tailwind, responsive",
    techStack: "React 19, Vite, TailwindCSS",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [sourceFile, setSourceFile] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setPreviewImages(files);
  };

  const handleSourceSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSourceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!sourceFile) {
      setError("Template Source ZIP archive is required!");
      setStep(2);
      return;
    }

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
      formData.append("techStack", JSON.stringify(form.techStack.split(",").map((s) => s.trim())));

      previewImages.forEach((img) => {
        formData.append("previewImages", img);
      });

      formData.append("sourceFile", sourceFile);

      await devApi.createTemplate(formData, (percent) => setUploadProgress(percent));

      setTimeout(() => {
        navigate("/developer/templates");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || "Failed to submit template."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <DeveloperNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white">Submit New Template</h1>
          <p className="text-xs text-slate-400 mt-1">
            Follow the multi-step form below to upload your template for admin review.
          </p>
        </div>

        {/* Wizard Stepper */}
        <div className="grid grid-cols-4 gap-2 border-b border-slate-800 pb-4 text-xs font-semibold text-center">
          <div
            onClick={() => setStep(1)}
            className={`cursor-pointer py-2 rounded-xl transition ${
              step === 1 ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            1. Details
          </div>
          <div
            onClick={() => setStep(2)}
            className={`cursor-pointer py-2 rounded-xl transition ${
              step === 2 ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            2. Files & Media
          </div>
          <div
            onClick={() => setStep(3)}
            className={`cursor-pointer py-2 rounded-xl transition ${
              step === 3 ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            3. Pricing
          </div>
          <div
            onClick={() => setStep(4)}
            className={`cursor-pointer py-2 rounded-xl transition ${
              step === 4 ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:bg-slate-900"
            }`}
          >
            4. Review & Submit
          </div>
        </div>

        {error && (
          <div className="p-4 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-4">Step 1: Basic Template Info</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Template Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Apex SaaS Dashboard & Landing Page"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your template features, layout structure, and ideal use cases..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Browser Compatibility</label>
                  <input
                    type="text"
                    name="compatibility"
                    value={form.compatibility}
                    onChange={handleChange}
                    placeholder="All Modern Browsers (Chrome, Firefox, Safari)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  name="techStack"
                  value={form.techStack}
                  onChange={handleChange}
                  placeholder="React 19, Vite, TailwindCSS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="react, SaaS, dashboard, dark-mode"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.title || !form.description}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Next: Files & Media →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Files & Media */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-2">Step 2: Files & Media Uploads</h3>

              {/* Source ZIP */}
              <div className="p-5 bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-3">
                <FaFileArchive className="text-4xl text-indigo-400 mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-white">Source ZIP Package *</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload template source archive (Max 50MB). Automatically scanned for malicious scripts.
                  </p>
                </div>
                <input
                  type="file"
                  accept=".zip"
                  onChange={handleSourceSelect}
                  className="hidden"
                  id="source-zip-input"
                />
                <label
                  htmlFor="source-zip-input"
                  className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {sourceFile ? `Selected: ${sourceFile.name}` : "Choose ZIP File"}
                </label>
              </div>

              {/* Preview Images */}
              <div className="p-5 bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl text-center space-y-3">
                <FaImages className="text-4xl text-indigo-400 mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-white">Preview Screenshots (Up to 5)</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload PNG, JPG, or WebP images to display on product page.
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="preview-images-input"
                />
                <label
                  htmlFor="preview-images-input"
                  className="inline-block bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  {previewImages.length > 0
                    ? `Selected ${previewImages.length} images`
                    : "Choose Screenshots"}
                </label>
              </div>

              {/* Live Preview URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Live Demo Preview URL</label>
                <input
                  type="url"
                  name="livePreviewUrl"
                  value={form.livePreviewUrl}
                  onChange={handleChange}
                  placeholder="https://my-template-demo.vercel.app"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!sourceFile}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Next: Pricing & License →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-2">Step 3: Pricing & Licensing</h3>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Free Template</h4>
                  <p className="text-xs text-slate-400">Offer this template for free to get more downloads</p>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price ($ USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      name="price"
                      min={1}
                      value={form.price}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">License Type</label>
                <select
                  name="license"
                  value={form.license}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                >
                  <option value="personal">Personal License (Single project use)</option>
                  <option value="commercial">Commercial License (Multiple end projects)</option>
                  <option value="extended">Extended License (SaaS / Redistribution)</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  Next: Review & Submit →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-white mb-2">Step 4: Final Review & Security Inspection</h3>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Title:</span>
                  <span className="font-bold text-white">{form.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-indigo-400 capitalize">{form.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Pricing:</span>
                  <span className="font-bold text-emerald-400">
                    {form.isFree ? "Free Download" : `$${form.price}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Source Archive:</span>
                  <span className="font-bold text-amber-400">{sourceFile?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preview Images:</span>
                  <span className="font-bold text-white">{previewImages.length} attached</span>
                </div>
              </div>

              {submitting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400 font-semibold">
                    <span>Uploading & Security Scanning...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={submitting}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-950/40"
                >
                  <FaUpload /> {submitting ? "Uploading..." : "Submit Template for Review"}
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default UploadTemplate;
