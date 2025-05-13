import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TemplateCard from '../components/TemplateCard';
import Footer from '../components/Footer';
import API from '../userapi/userapi';
import Loader from "../components/Loading";
import AOS from "aos";
import "aos/dist/aos.css";
import Contact from './Contact';
import About from './About';

const Home = () => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      try {
        const response = await API.get('/templates/featured');
        setFeaturedTemplates(shuffleArray(response.data));
      } catch (error) {
        console.error('Error fetching featured templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, []);

  return (
    <div className="bg-gradient-to-tr from-blue-50 via-purple-100 to-indigo-50">
      <Navbar scrollToAbout={scrollToAbout} scrollToContact={scrollToContact} />
      <HeroSection />

      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
            data-aos="fade-up"
          >
            Featured Templates
          </h2>

          {loading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredTemplates.map((template, index) => (
                <div
                  key={template.tempId}
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

      {/* About Section */}
      <div ref={aboutRef}>
        <About />
      </div>

      {/* Contact Section */}
      <div ref={contactRef}>
        <Contact />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
