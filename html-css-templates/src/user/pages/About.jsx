import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      <Navbar />
      <section className="pt-28 pb-20 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 text-gray-700">
        <div className="max-w-6xl mx-auto px-6 text-center" data-aos="fade-up">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-6">About Us</h1>
          <p className="text-lg leading-relaxed mb-6">
            We craft modern and responsive HTML/CSS templates to help developers and creators launch faster.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Our mission is to make beautiful UI templates affordable and accessible for everyone. Whether you're a student, freelancer, or business owner, our hand-crafted templates help you build faster with clean, responsive code.
          </p>
          <p className="text-lg leading-relaxed">
            Built with ❤️ by passionate front-end designers and developers. Every template is optimized for SEO, performance, and modern best practices.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
