import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import TemplateCard from '../components/TemplateCard';
import Footer from '../components/Footer';
import API from '../userapi/userapi';
import Loader from "../components/Loading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AOS from "aos";
import "aos/dist/aos.css";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

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
    <div className="bg-gradient-to-tr from-blue-50 via-purple-100 to-indigo-50">
      <Navbar scrollToAbout={scrollToAbout} scrollToContact={scrollToContact} />
      <HeroSection />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">Featured Templates</h2>
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
        className="py-20 bg-gradient-to-tr from-blue-50 via-purple-100 to-pink-50 text-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Content */}
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <h2 className="text-4xl font-bold mb-4 text-blue-700">About Us</h2>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Creativity Meets Code — One Template at a Time.
            </h3>
            <p className="mb-4 text-gray-600">
              At <strong>DevCanvas</strong>, we merge design passion with development precision. Our platform offers professionally crafted HTML/CSS templates and a freelance hub where visionaries and coders collaborate.
            </p>
            <p className="mb-4 text-gray-600">
              Whether you're a solo entrepreneur, an agency, or a developer racing against deadlines — our ready-to-use components and freelancers are your secret weapons.
            </p>
            <p className="text-gray-600">
              Every pixel we deliver is optimized for performance, responsiveness, and user experience. Join us and turn your ideas into seamless digital realities.
            </p>
          </div>

          {/* Right Image Collage */}
          <div className="w-full md:w-1/2 flex justify-center gap-4" data-aos="fade-left">
            <img
              src="/assets/slice-1.png"
              alt="Dev work slice 1"
              className="w-24 rounded-3xl shadow-xl object-cover"
            />
            <img
              src="/assets/slice-2.png"
              alt="Dev work slice 2"
              className="w-24 rounded-3xl shadow-xl object-cover"
            />
            <img
              src="/assets/slice-3.png"
              alt="Dev work slice 3"
              className="w-24 rounded-3xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        className="py-20 bg-gradient-to-tr from-blue-50 via-purple-100 to-teal-50 text-gray-800"
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
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
