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
      <section className="pt-28 px-4 pb-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
          <p className="text-gray-600 mb-6 text-center">
            We craft modern and responsive HTML/CSS templates to help developers and creators launch faster.
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Our mission is to make beautiful UI templates affordable and accessible for everyone. Whether you're a student, freelancer, or business owner, our hand-crafted templates help you build faster with clean, responsive code.
            </p>
            <p>
              Every template is optimized for SEO, performance, and modern best practices. We believe in quality, accessibility, and open design — and our free and premium templates reflect that.
            </p>
            <p>
              Built with ❤️ by passionate front-end designers and developers. We're constantly adding new designs — stay tuned!
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
