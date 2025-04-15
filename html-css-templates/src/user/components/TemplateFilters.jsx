import { useState } from 'react';

const TemplateFilters = ({ onSearch, onCategoryChange, onPriceFilter }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10" data-aos="fade-up">
      <input
        type="text"
        value={searchText}
        onChange={handleSearch}
        placeholder="Search templates..."
        className="border px-4 py-2 rounded-md w-full md:w-1/3"
      />

      <select onChange={(e) => onCategoryChange(e.target.value)} className="border px-4 py-2 rounded-md">
        <option value="">All Categories</option>
        <option value="Portfolio">Portfolio</option>
        <option value="Business">Business</option>
        <option value="SaaS">SaaS</option>
        <option value="Agency">Agency</option>
        <option value="Resume">Resume</option>
        <option value="eCommerce">eCommerce</option>
      </select>

      <select onChange={(e) => onPriceFilter(e.target.value)} className="border px-4 py-2 rounded-md">
        <option value="">All</option>
        <option value="free">Free</option>
        <option value="paid">Paid</option>
      </select>
    </div>
  );
};

export default TemplateFilters;
