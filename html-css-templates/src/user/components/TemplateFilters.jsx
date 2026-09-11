import { useState } from 'react';

const categories = ["Portfolio", "Business", "SaaS", "Agency", "Resume", "eCommerce"];
const priceOptions = ["free", "paid"];

const TemplateFilters = ({ onSearch, onCategoryChange, onPriceFilter }) => {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10" data-aos="fade-up">
      
      {/* Search Input with Icon */}
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search templates..."
          className="w-full pl-10 pr-4 py-2 border rounded-md bg-gradient-to-br from-indigo-50 to-purple-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <svg
          className="absolute left-3 top-2.5 text-gray-500 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
        >
          <path
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          onCategoryChange(e.target.value);
        }}
        className="border px-4 py-2 rounded-md bg-gradient-to-br from-indigo-50 to-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Price Filter Dropdown */}
      <select
        value={price}
        onChange={(e) => {
          setPrice(e.target.value);
          onPriceFilter(e.target.value);
        }}
        className="border px-4 py-2 rounded-md bg-gradient-to-br from-indigo-50 to-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        <option value="">All</option>
        {priceOptions.map((option) => (
          <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
        ))}
      </select>
    </div>
  );
};

export default TemplateFilters;
