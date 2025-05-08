import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TemplateCard from '../components/TemplateCard';
import Footer from '../components/Footer';
import API from '../userapi/userapi';
import Loader from "../components/Loading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

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

  useEffect(() => {
    // GSAP animation for the About section
    gsap.fromTo(
      aboutRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse", // Replays animation on scroll up and down
        },
      }
    );

    // GSAP animation for the Contact section
    gsap.fromTo(
      contactRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse", // Replays animation on scroll up and down
        },
      }
    );
  }, []);

  return (
    <>
      <Navbar />
      <HeroSection />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">Featured Templates</h2>
          {loading ? (
            <Loader />
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTemplates.map((template) => (
                <TemplateCard key={template.tempId} template={template} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="py-20 bg-gray-100 text-gray-700"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">About Us</h2>
          <p className="text-lg leading-relaxed mb-6">
            We craft modern and responsive HTML/CSS templates to help developers and creators launch faster. 
            Our mission is to make beautiful UI templates affordable and accessible for everyone.
          </p>
          <p className="text-lg leading-relaxed">
            Built with ❤️ by passionate front-end designers and developers. Every template is optimized for SEO, performance, and modern best practices.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        className="py-20 bg-white text-gray-700"
      >
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg leading-relaxed mb-6">
            Got a question, suggestion, or just want to say hi? Drop us a message below!
          </p>
          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border rounded px-3 py-2"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
