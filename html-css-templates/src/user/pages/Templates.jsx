import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TemplateCard from '../components/TemplateCard';
import TemplateFilters from '../components/TemplateFilters';
import API from '../userapi/userapi';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });

    const fetchTemplates = async () => {
      try {
        const { data } = await API.get('/templates');
        setTemplates(shuffleArray(data));
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

      <section className="pt-20 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen">
        <div className="container mx-auto max-w-screen-xl">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-10 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            Browse HTML + CSS Templates
          </h2>

          <div data-aos="fade-up">
            <TemplateFilters
              onSearch={handleSearch}
              onCategoryChange={handleCategory}
              onPriceFilter={handlePrice}
            />
          </div>

          {filteredTemplates.length === 0 ? (
            <p className="text-center text-gray-600 text-sm sm:text-base mt-8" data-aos="fade-up">
              No templates found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
              {filteredTemplates.map((template, index) => (
                <div
                  key={template._id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="w-full"
                >
                  <TemplateCard template={template} />
                </div>
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
