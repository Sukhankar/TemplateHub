import { useEffect, useRef } from "react";
import gsap from "gsap";
import CardSwap, { Card } from "../components/CardSwap";

const HeroSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      sectionRef.current.querySelector(".hero-text"),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(
        sectionRef.current.querySelector(".hero-subtext"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.6"
      )
      .fromTo(
        sectionRef.current.querySelector(".hero-buttons"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.4"
      );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 hero-text">
            Craft Stunning Websites with Ease
          </h1>
          <p className="text-lg mb-8 text-indigo-100 hero-subtext">
            Discover premium HTML/CSS templates and get custom development — all under one roof.
          </p>
          <div className="flex justify-center lg:justify-start gap-4 hero-buttons">
            <a
              href="/templates"
              className="relative inline-block px-6 py-3 font-semibold text-indigo-600 bg-white rounded-full group overflow-hidden transition-all duration-300 hover:bg-gray-100"
            >
              <span className="relative z-10 group-hover:text-indigo-100 transition-colors duration-300">Browse Templates</span>
              <span className="absolute inset-0 bg-black scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 z-0" />
            </a>

            <a
              href="/services"
              className="relative inline-block px-6 py-3 font-semibold text-white border-2 border-white rounded-full group overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">Hire a Freelancer</span>
              <span className="absolute inset-0 bg-white scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100 z-0" />
            </a>
          </div>
        </div>

        {/* Right Hero Graphic with CardSwap */}
        <div className="m-2 w-full lg:w-1/2 relative flex justify-center lg:justify-end pt-10">
          <CardSwap
            width={320}
            height={220}
            cardDistance={55}
            verticalDistance={60}
            delay={4000}
            skewAmount={5}
            easing="elastic"
          >
            <Card customClass="bg-white text-black flex items-center justify-center text-xl font-bold shadow-2xl">
              Templates
            </Card>
            <Card customClass="bg-indigo-100 text-indigo-800 flex items-center justify-center text-xl font-bold shadow-2xl">
              Freelancers
            </Card>
            <Card customClass="bg-purple-100 text-purple-800 flex items-center justify-center text-xl font-bold shadow-2xl">
              Services
            </Card>
          </CardSwap>
        </div>
      </div>

      {/* Decorative SVG */}
      <svg
        className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 opacity-30"
        width="400"
        height="400"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="200" cy="200" r="200" fill="white" />
      </svg>
    </section>
  );
};

export default HeroSection;
