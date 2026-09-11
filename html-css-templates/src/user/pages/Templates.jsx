import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  FaSearch,
  FaFilter,
  FaStar,
  FaEye,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaTh,
  FaList,
  FaExternalLinkAlt,
  FaTimes,
  FaCheck,
} from "react-icons/fa";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  // Quick View Modal
  const [quickViewItem, setQuickViewItem] = useState(null);

  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort,
      };

      if (search) params.q = search;
      if (category !== "all") params.category = category;
      if (selectedTechs.length > 0) params.techStack = selectedTechs.join(",");
      if (isFreeOnly) params.isFree = "true";
      if (maxPrice < 100) params.maxPrice = maxPrice;
      if (minRating > 0) params.minRating = minRating;

      const res = await axiosInstance.get("/templates", { params });
      setTemplates(res.data.templates || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Error loading marketplace templates:", err);
    } finally {
      setLoading(false);
    }
  }, [page, sort, search, category, selectedTechs, isFreeOnly, maxPrice, minRating]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleTechToggle = (tech) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearch("");
    setCategory("all");
    setSelectedTechs([]);
    setIsFreeOnly(false);
    setMaxPrice(100);
    setMinRating(0);
    setSort("newest");
    setPage(1);
  };

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "landing-page", label: "Landing Page" },
    { id: "portfolio", label: "Portfolio" },
    { id: "ecommerce", label: "E-Commerce" },
    { id: "blog", label: "Blog & Magazine" },
    { id: "dashboard", label: "Admin & Dashboard" },
    { id: "other", label: "Other" },
  ];

  const availableTechStacks = ["React", "Vite", "TailwindCSS", "HTML5", "CSS3", "JavaScript"];

  const isWishlisted = (id) => wishlist?.some((item) => item._id === id);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white border-b border-indigo-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
            Digital Marketplace
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Explore Website Templates
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 max-w-2xl mx-auto">
            Discover curated, responsive HTML, CSS, React, and Tailwind website templates built by independent developers.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FaFilter className="text-indigo-600 text-sm" /> Filters
              </h3>
              {(category !== "all" ||
                selectedTechs.length > 0 ||
                isFreeOnly ||
                maxPrice < 100 ||
                minRating > 0 ||
                search) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      category === cat.id
                        ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Only Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700">Free Templates Only</span>
              <input
                type="checkbox"
                checked={isFreeOnly}
                onChange={(e) => {
                  setIsFreeOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            {/* Max Price Slider */}
            {!isFreeOnly && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Max Price</span>
                  <span className="text-indigo-600">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            )}

            {/* Tech Stack Pills */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">Tech Stack</label>
              <div className="flex flex-wrap gap-1.5">
                {availableTechStacks.map((tech) => {
                  const isSelected = selectedTechs.includes(tech);
                  return (
                    <button
                      key={tech}
                      onClick={() => handleTechToggle(tech)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-2">Minimum Rating</label>
              <div className="flex items-center gap-1">
                {[4, 3, 2, 1].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => {
                      setMinRating(minRating === stars ? 0 : stars);
                      setPage(1);
                    }}
                    className={`flex-1 py-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border transition ${
                      minRating === stars
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {stars} <FaStar className="text-[10px]" />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Product Section */}
          <div className="flex-1 space-y-6">
            {/* Control Top Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-slate-500 font-medium">
                Showing <span className="font-bold text-slate-900">{templates.length}</span> of{" "}
                <span className="font-bold text-slate-900">{total}</span> templates
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">Sort:</span>
                  <select
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none font-semibold text-slate-800"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* View Switcher */}
                <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
                    }`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
                    }`}
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Tags */}
            {(category !== "all" || selectedTechs.length > 0 || isFreeOnly) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Active Filters:</span>
                {category !== "all" && (
                  <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-semibold border border-indigo-200">
                    Category: {category}
                    <FaTimes
                      className="cursor-pointer hover:text-indigo-900"
                      onClick={() => setCategory("all")}
                    />
                  </span>
                )}
                {isFreeOnly && (
                  <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                    Free Only
                    <FaTimes
                      className="cursor-pointer hover:text-emerald-900"
                      onClick={() => setIsFreeOnly(false)}
                    />
                  </span>
                )}
                {selectedTechs.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-semibold border border-purple-200"
                  >
                    {tech}
                    <FaTimes
                      className="cursor-pointer hover:text-purple-900"
                      onClick={() => handleTechToggle(tech)}
                    />
                  </span>
                ))}
              </div>
            )}

            {/* Template Cards Grid / List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 animate-pulse"
                  >
                    <div className="h-44 bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : templates.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                <h3 className="text-lg font-bold text-slate-800">No Templates Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find any templates matching your search and filter criteria. Try adjusting your filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {templates.map((tpl) => (
                  <div
                    key={tpl._id}
                    className={`bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex ${
                      viewMode === "grid" ? "flex-col" : "flex-col sm:flex-row"
                    }`}
                  >
                    {/* Media Preview */}
                    <div
                      className={`relative overflow-hidden bg-slate-100 ${
                        viewMode === "grid" ? "aspect-video" : "sm:w-64 aspect-video shrink-0"
                      }`}
                    >
                      <img
                        src={tpl.previewImages?.[0] || "/placeholder.jpg"}
                        alt={tpl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                          {tpl.category}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          isWishlisted(tpl._id)
                            ? removeFromWishlist(tpl._id)
                            : addToWishlist(tpl)
                        }
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-700 hover:text-rose-500 shadow-md transition"
                      >
                        {isWishlisted(tpl._id) ? (
                          <FaHeart className="text-rose-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>

                      {/* Hover Overlay Action */}
                      <div className="absolute inset-0 bg-indigo-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setQuickViewItem(tpl)}
                          className="bg-white text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg hover:bg-indigo-50"
                        >
                          <FaEye /> Quick View
                        </button>
                        {tpl.livePreviewUrl && (
                          <Link
                            to={`/preview/${tpl._id}`}
                            className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-lg hover:bg-indigo-500"
                          >
                            <FaExternalLinkAlt /> Live Demo
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Product Specs & Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 font-medium">
                            By {tpl.sellerId?.name || "Developer"}
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-bold">
                            <FaStar /> {tpl.averageRating ? tpl.averageRating.toFixed(1) : "New"}
                          </span>
                        </div>

                        <Link to={`/template/${tpl._id}`}>
                          <h3 className="font-bold text-base text-slate-900 hover:text-indigo-600 transition line-clamp-1">
                            {tpl.title}
                          </h3>
                        </Link>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {tpl.description}
                        </p>
                      </div>

                      {/* Tech Stack Badges */}
                      {tpl.techStack && tpl.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {tpl.techStack.slice(0, 3).map((tech, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Price & Action */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="font-black text-lg text-slate-900">
                          {tpl.isFree || tpl.price === 0 ? (
                            <span className="text-emerald-600 font-bold text-base">FREE</span>
                          ) : (
                            `$${tpl.price}`
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(tpl)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                            isInCart(tpl._id)
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          }`}
                        >
                          {isInCart(tpl._id) ? (
                            <>
                              <FaCheck /> In Cart
                            </>
                          ) : (
                            <>
                              <FaShoppingCart /> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition ${
                      page === pageNum
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-slate-700 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Quick View Modal */}
      {quickViewItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setQuickViewItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800"
            >
              <FaTimes />
            </button>

            <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden">
              <img
                src={quickViewItem.previewImages?.[0] || "/placeholder.jpg"}
                alt={quickViewItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {quickViewItem.category}
              </span>
              <h2 className="text-xl font-bold text-slate-900">{quickViewItem.title}</h2>
              <p className="text-xs text-slate-600 mt-2">{quickViewItem.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="font-black text-2xl text-slate-900">
                {quickViewItem.isFree || quickViewItem.price === 0
                  ? "FREE"
                  : `$${quickViewItem.price}`}
              </div>

              <div className="flex items-center gap-3">
                {quickViewItem.livePreviewUrl && (
                  <Link
                    to={`/preview/${quickViewItem._id}`}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200"
                  >
                    Live Demo
                  </Link>
                )}
                <Link
                  to={`/template/${quickViewItem._id}`}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Templates;
