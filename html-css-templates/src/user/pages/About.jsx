import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const stats = [
    { label: "Templates", end: 150 },
    { label: "Users", end: 2000 },
  ];

  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters((prev) =>
        prev.map((val, i) => (val < stats[i].end ? val + Math.ceil(stats[i].end / 50) : stats[i].end))
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="pt-16 md:pt-24 lg:pt-28 pb-10 md:pb-16 lg:pb-20 bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 lg:gap-10">
          
          {/* Left Content */}
          <div className="w-full md:w-1/2" data-aos="fade-right">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-blue-700">About Us</h2>

            {/* Typewriter effect */}
            <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-gray-800 animate-typing overflow-hidden whitespace-nowrap border-r-2 border-gray-700 pr-3">
              Creativity Meets Code — One Template at a Time.
            </h3>

            <p className="mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base text-gray-600">
              At <strong>DevCanvas</strong>, we merge design passion with development precision. Our platform offers professionally crafted HTML/CSS templates and a freelance hub where visionaries and coders collaborate.
            </p>
            <p className="mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm lg:text-base text-gray-600">
              Whether you're a solo entrepreneur, an agency, or a developer racing against deadlines — our ready-to-use components and freelancers are your secret weapons.
            </p>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              Every pixel we deliver is optimized for performance, responsiveness, and user experience. Join us and turn your ideas into seamless digital realities.
            </p>

            {/* Stats */}
            <div className="mt-3 sm:mt-4 lg:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
              {stats.map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{counters[i]}+</p>
                  <p className="text-xs sm:text-sm text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Collage */}
          <div
            className="w-full md:w-1/2 flex justify-center gap-2 sm:gap-3 lg:gap-4 flex-wrap mt-6 md:mt-0"
            data-aos="fade-left"
          >
            {["slice-1.png", "slice-2.png", "slice-3.png"].map((src, idx) => (
              <img
                key={idx}
                src={`/assets/${src}`}
                alt={`Dev work ${idx + 1}`}
                className="w-16 sm:w-20 lg:w-24 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-md sm:shadow-lg lg:shadow-xl object-cover transform transition duration-300 hover:scale-110 hover:shadow-lg sm:hover:shadow-xl lg:hover:shadow-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
