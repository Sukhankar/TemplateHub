import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import aboutHero from "../../assets/about-hero.jpg";
 // Import the image

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Navbar />
      <section className="pt-28 px-4 pb-20 bg-gray-50 min-h-screen">
       <div className="max-w-6xl mx-auto px-4">
  <div className="bg-white rounded-xl shadow-2xl p-10">
    <div className="space-y-12">
      {/* Title */}
      <div data-aos="fade-up" className="text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 text-indigo-800">
          About Us
        </h1>
        <p className="text-indigo-600 text-lg">
          We craft modern and responsive HTML/CSS templates to help developers and creators launch faster.
        </p>
      </div>

      {/* Two-column layout with image */}
      <div data-aos="fade-right" className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            Our mission is to make beautiful UI templates affordable and accessible for everyone.
            Whether you're a student, freelancer, or business owner, our hand‑crafted templates help
            you build faster with clean, responsive code.
          </p>
          <p>
            Every template is optimized for SEO, performance, and modern best practices.
            We believe in quality, accessibility, and open design — and our free and premium templates reflect that.
          </p>
          <p>
            Built with ❤️ by passionate front‑end designers and developers.
            We're constantly adding new designs — stay tuned!
          </p>
        </div>
        <div className="overflow-hidden rounded-lg shadow-lg">
          <img
            src={aboutHero}
            alt="Team working together"
            className="w-full h-auto transform hover:scale-105 transition duration-500 ease-out"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div data-aos="zoom-in" className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { num: "100+", label: "Templates Available" },
          { num: "10K+", label: "Happy Users" },
          { num: "5", label: "Years in Business" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-indigo-50 rounded-lg shadow p-6 hover:shadow-xl transition"
          >
            <h3 className="text-3xl font-bold text-indigo-600">{item.num}</h3>
            <p className="text-gray-600 mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

      </section>
      <Footer />
    </>
  );
};

export default About;
