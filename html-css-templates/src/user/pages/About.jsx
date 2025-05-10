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
      <section className="pt-28 pb-20 bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-50 text-gray-800">
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
      
    </>
  );
};

export default About;