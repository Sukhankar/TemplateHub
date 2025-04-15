import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TemplateCard from '../components/TemplateCard';
import TemplateFilters from '../components/TemplateFilters';
import API from '../userapi/userapi';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await API.get('/templates');
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };
    fetchTemplates();
  }, []);

  const filterTemplates = () => {
    let filtered = templates;

    if (search) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (priceFilter === 'free') {
      filtered = filtered.filter((t) => t.price === 0);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter((t) => t.price > 0);
    }

    return filtered;
  };

  const handleSearch = (val) => {
    setSearch(val);
  };

  const handleCategory = (val) => {
    setCategory(val);
  };

  const handlePrice = (val) => {
    setPriceFilter(val);
  };

  const filteredTemplates = filterTemplates();

  return (
    <>
      <Navbar />
      <section className="pt-32 pb-16 px-4 bg-white min-h-screen">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-10" data-aos="fade-up">
            Browse HTML + CSS Templates
          </h2>

          <TemplateFilters
            onSearch={handleSearch}
            onCategoryChange={handleCategory}
            onPriceFilter={handlePrice}
          />

          {filteredTemplates.length === 0 ? (
            <p className="text-center text-gray-500" data-aos="fade-up">
              No templates found.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template._id} template={template} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Templates;
