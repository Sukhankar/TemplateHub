import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TemplateCard from '../components/TemplateCard';
import Footer from '../components/Footer';
import API from '../userapi/userapi';

const Home = () => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      try {
        const response = await API.get('/templates/featured');
        setFeaturedTemplates(response.data);
      } catch (error) {
        console.error('Error fetching featured templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">Featured Templates</h2>
          {loading ? (
            <div className="text-center">Loading featured templates...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTemplates.map((template) => (
                <TemplateCard key={template.tempId} template={template} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional sections can go here (About snippet, Testimonials, etc.) */}
      
      <Footer />
    </>
  );
};

export default Home;
